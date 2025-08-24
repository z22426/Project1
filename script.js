// Todo App JavaScript
class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilters = {
            category: 'all',
            priority: 'all',
            status: 'all',
            search: ''
        };
        this.editingTaskId = null;
        this.draggedTask = null;
        
        this.init();
    }

    init() {
        this.loadTasks();
        this.setupEventListeners();
        this.setupTheme();
        this.renderTasks();
        this.updateStats();
        this.checkReminders();
        
        // Check reminders every minute
        setInterval(() => this.checkReminders(), 60000);
    }

    setupEventListeners() {
        // Modal controls
        document.getElementById('addTaskBtn').addEventListener('click', () => this.openModal());
        document.getElementById('addFirstTaskBtn').addEventListener('click', () => this.openModal());
        document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        
        // Form submission
        document.getElementById('taskForm').addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e.target.value));
        document.getElementById('clearSearch').addEventListener('click', () => this.clearSearch());
        
        // Filter controls
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter('category', e.target.closest('.category-filter').dataset.category));
        });
        
        document.querySelectorAll('.priority-filter').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter('priority', e.target.closest('.priority-filter').dataset.priority));
        });
        
        document.querySelectorAll('.status-filter').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter('status', e.target.closest('.status-filter').dataset.status));
        });
        
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Mobile menu toggle
        document.getElementById('menuToggle').addEventListener('click', () => this.toggleMobileMenu());
        
        // Click outside modal to close
        document.getElementById('taskModal').addEventListener('click', (e) => {
            if (e.target.id === 'taskModal') this.closeModal();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    setupTheme() {
        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (systemPrefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        
        this.updateThemeIcon();
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('active');
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + N to add new task
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.openModal();
        }
        
        // Escape to close modal
        if (e.key === 'Escape') {
            this.closeModal();
        }
    }

    openModal(taskId = null) {
        const modal = document.getElementById('taskModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('taskForm');
        
        if (taskId) {
            // Edit mode
            this.editingTaskId = taskId;
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                modalTitle.textContent = 'Edit Task';
                this.populateForm(task);
            }
        } else {
            // Add mode
            this.editingTaskId = null;
            modalTitle.textContent = 'Add New Task';
            form.reset();
            
            // Set default due date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            document.getElementById('taskDueDate').value = tomorrow.toISOString().split('T')[0];
        }
        
        modal.classList.add('active');
        document.getElementById('taskTitle').focus();
    }

    closeModal() {
        const modal = document.getElementById('taskModal');
        modal.classList.remove('active');
        this.editingTaskId = null;
    }

    populateForm(task) {
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskCategory').value = task.category;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskDueDate').value = task.dueDate || '';
        document.getElementById('taskReminder').value = task.reminder || '';
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const taskData = {
            title: formData.get('title').trim(),
            description: formData.get('description').trim(),
            category: formData.get('category'),
            priority: formData.get('priority'),
            dueDate: formData.get('dueDate') || null,
            reminder: formData.get('reminder') || null
        };
        
        if (!taskData.title) {
            this.showNotification('Please enter a task title', 'error');
            return;
        }
        
        if (this.editingTaskId) {
            this.updateTask(this.editingTaskId, taskData);
        } else {
            this.addTask(taskData);
        }
        
        this.closeModal();
    }

    addTask(taskData) {
        const task = {
            id: this.generateId(),
            ...taskData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            completedAt: null
        };
        
        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        
        this.showNotification('Task added successfully!', 'success');
        
        // Schedule reminder if set
        if (task.reminder) {
            this.scheduleReminder(task);
        }
    }

    updateTask(taskId, taskData) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;
        
        const oldTask = this.tasks[taskIndex];
        this.tasks[taskIndex] = {
            ...oldTask,
            ...taskData,
            updatedAt: new Date().toISOString()
        };
        
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        
        this.showNotification('Task updated successfully!', 'success');
        
        // Update reminder if changed
        if (taskData.reminder !== oldTask.reminder) {
            if (taskData.reminder) {
                this.scheduleReminder(this.tasks[taskIndex]);
            }
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            
            this.showNotification('Task deleted successfully!', 'success');
        }
    }

    toggleTaskStatus(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        task.status = task.status === 'completed' ? 'pending' : 'completed';
        task.completedAt = task.status === 'completed' ? new Date().toISOString() : null;
        
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        
        const statusText = task.status === 'completed' ? 'completed' : 'marked as pending';
        this.showNotification(`Task ${statusText}!`, 'success');
    }

    setFilter(type, value) {
        this.currentFilters[type] = value;
        
        // Update active states
        if (type === 'category') {
            document.querySelectorAll('.category-filter').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.category === value);
            });
        } else if (type === 'priority') {
            document.querySelectorAll('.priority-filter').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.priority === value);
            });
        } else if (type === 'status') {
            document.querySelectorAll('.status-filter').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.status === value);
            });
        }
        
        this.renderTasks();
    }

    handleSearch(query) {
        this.currentFilters.search = query.toLowerCase();
        this.renderTasks();
        
        // Show/hide clear search button
        const clearBtn = document.getElementById('clearSearch');
        clearBtn.style.display = query ? 'block' : 'none';
    }

    clearSearch() {
        document.getElementById('searchInput').value = '';
        this.currentFilters.search = '';
        this.renderTasks();
        document.getElementById('clearSearch').style.display = 'none';
    }

    getFilteredTasks() {
        return this.tasks.filter(task => {
            // Category filter
            if (this.currentFilters.category !== 'all' && task.category !== this.currentFilters.category) {
                return false;
            }
            
            // Priority filter
            if (this.currentFilters.priority !== 'all' && task.priority !== this.currentFilters.priority) {
                return false;
            }
            
            // Status filter
            if (this.currentFilters.status !== 'all' && task.status !== this.currentFilters.status) {
                return false;
            }
            
            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search;
                const searchableText = `${task.title} ${task.description}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }
            
            return true;
        });
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        const emptyState = document.getElementById('emptyState');
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            taskList.innerHTML = '';
            emptyState.classList.add('active');
            return;
        }
        
        emptyState.classList.remove('active');
        
        taskList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
        
        // Add event listeners to task items
        this.setupTaskEventListeners();
        
        // Setup drag and drop
        this.setupDragAndDrop();
    }

    createTaskHTML(task) {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const isOverdue = dueDate && dueDate < new Date() && task.status !== 'completed';
        const dueDateText = dueDate ? dueDate.toLocaleDateString() : 'No due date';
        
        return `
            <div class="task-item ${task.status === 'completed' ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}" 
                 data-task-id="${task.id}" draggable="true">
                <div class="task-header">
                    <div class="task-title">${this.escapeHtml(task.title)}</div>
                    <div class="task-actions">
                        <button class="task-action-btn complete" title="Mark as ${task.status === 'completed' ? 'pending' : 'completed'}">
                            <i class="fas fa-${task.status === 'completed' ? 'undo' : 'check'}"></i>
                        </button>
                        <button class="task-action-btn edit" title="Edit task">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="task-action-btn delete" title="Delete task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                
                <div class="task-meta">
                    <span class="task-category">
                        <span class="category-dot ${task.category}"></span>
                        ${task.category}
                    </span>
                    <span class="task-priority ${task.priority}">
                        <span class="priority-indicator ${task.priority}"></span>
                        ${task.priority}
                    </span>
                    <span class="task-due-date ${isOverdue ? 'overdue' : ''}">
                        <i class="fas fa-calendar"></i>
                        ${dueDateText}
                    </span>
                </div>
            </div>
        `;
    }

    setupTaskEventListeners() {
        document.querySelectorAll('.task-item').forEach(taskItem => {
            const taskId = taskItem.dataset.taskId;
            
            // Complete/pending toggle
            taskItem.querySelector('.complete').addEventListener('click', () => {
                this.toggleTaskStatus(taskId);
            });
            
            // Edit task
            taskItem.querySelector('.edit').addEventListener('click', () => {
                this.openModal(taskId);
            });
            
            // Delete task
            taskItem.querySelector('.delete').addEventListener('click', () => {
                this.deleteTask(taskId);
            });
        });
    }

    setupDragAndDrop() {
        const taskItems = document.querySelectorAll('.task-item');
        
        taskItems.forEach(item => {
            item.addEventListener('dragstart', (e) => this.handleDragStart(e));
            item.addEventListener('dragend', (e) => this.handleDragEnd(e));
            item.addEventListener('dragover', (e) => this.handleDragOver(e));
            item.addEventListener('drop', (e) => this.handleDrop(e));
            item.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            item.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        });
    }

    handleDragStart(e) {
        this.draggedTask = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedTask = null;
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDragEnter(e) {
        e.preventDefault();
        if (e.target.classList.contains('task-item') && e.target !== this.draggedTask) {
            e.target.classList.add('drag-over');
        }
    }

    handleDragLeave(e) {
        if (e.target.classList.contains('task-item')) {
            e.target.classList.remove('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        
        if (e.target.classList.contains('task-item') && this.draggedTask) {
            const draggedId = this.draggedTask.dataset.taskId;
            const targetId = e.target.dataset.taskId;
            
            if (draggedId !== targetId) {
                this.reorderTasks(draggedId, targetId);
            }
        }
        
        // Remove drag-over class
        document.querySelectorAll('.task-item').forEach(item => {
            item.classList.remove('drag-over');
        });
    }

    reorderTasks(draggedId, targetId) {
        const draggedIndex = this.tasks.findIndex(t => t.id === draggedId);
        const targetIndex = this.tasks.findIndex(t => t.id === targetId);
        
        if (draggedIndex === -1 || targetIndex === -1) return;
        
        // Remove dragged task
        const [draggedTask] = this.tasks.splice(draggedIndex, 1);
        
        // Insert at target position
        this.tasks.splice(targetIndex, 0, draggedTask);
        
        this.saveTasks();
        this.renderTasks();
        
        this.showNotification('Task reordered successfully!', 'success');
    }

    updateStats() {
        const totalTasks = this.tasks.length;
        const pendingTasks = this.tasks.filter(t => t.status === 'pending').length;
        const completedTasks = this.tasks.filter(t => t.status === 'completed').length;
        
        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
    }

    scheduleReminder(task) {
        if (!task.reminder) return;
        
        const reminderTime = new Date(task.reminder);
        const now = new Date();
        
        if (reminderTime > now) {
            const timeUntilReminder = reminderTime.getTime() - now.getTime();
            
            setTimeout(() => {
                this.showReminderNotification(task);
            }, timeUntilReminder);
        }
    }

    checkReminders() {
        const now = new Date();
        
        this.tasks.forEach(task => {
            if (task.reminder && task.status !== 'completed') {
                const reminderTime = new Date(task.reminder);
                const timeDiff = Math.abs(now.getTime() - reminderTime.getTime());
                const minutesDiff = Math.ceil(timeDiff / (1000 * 60));
                
                // Show notification if reminder is within 1 minute
                if (minutesDiff <= 1) {
                    this.showReminderNotification(task);
                }
            }
        });
    }

    showReminderNotification(task) {
        this.showNotification(`Reminder: ${task.title}`, 'info', 10000);
        
        // Browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Task Reminder', {
                body: task.title,
                icon: '/favicon.ico'
            });
        }
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notificationContainer = document.getElementById('notificationContainer');
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <i class="notification-icon ${iconMap[type]}"></i>
            <div class="notification-content">
                <div class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add close functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        notificationContainer.appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }

    // Utility functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // LocalStorage functions
    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('todoTasks');
        if (savedTasks) {
            try {
                this.tasks = JSON.parse(savedTasks);
            } catch (e) {
                console.error('Error loading tasks:', e);
                this.tasks = [];
            }
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});

// Request notification permission on page load
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}
