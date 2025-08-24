# Smart Todo App

A modern, responsive todo application built with HTML5, CSS3, and vanilla JavaScript. Features a clean, intuitive interface with full CRUD functionality, drag and drop reordering, and advanced filtering capabilities.

## ✨ Features

### 🎯 Core Functionality
- **Full CRUD Operations**: Create, Read, Update, and Delete tasks
- **Task Management**: Add, edit, complete, and delete tasks with ease
- **Status Tracking**: Mark tasks as pending or completed
- **Data Persistence**: All data is saved to localStorage

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Automatic theme switching based on system preferences
- **Smooth Animations**: Micro-interactions and transitions for better user experience
- **Clean Interface**: Modern design using CSS Grid and Flexbox

### 🔍 Advanced Features
- **Smart Search**: Real-time search through task titles and descriptions
- **Multiple Filters**: Filter by category, priority, and status
- **Drag & Drop**: Reorder tasks using HTML5 Drag and Drop API
- **Task Categories**: Color-coded categories (Work, Personal, Shopping, Health)
- **Priority Levels**: High, Medium, and Low priority indicators

### 📅 Date & Reminder System
- **Due Dates**: Set due dates for tasks with date picker
- **Reminders**: Schedule reminders with datetime picker
- **Overdue Detection**: Visual indicators for overdue tasks
- **Browser Notifications**: Desktop notifications for reminders

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Gesture support for mobile devices
- **Collapsible Sidebar**: Mobile-optimized navigation
- **Breakpoint System**: Responsive breakpoints at 1024px, 768px, and 480px

### ⌨️ Keyboard Shortcuts
- **Ctrl/Cmd + N**: Add new task
- **Escape**: Close modal
- **Tab Navigation**: Full keyboard accessibility

## 🚀 Getting Started

### Prerequisites
- Modern web browser with ES6+ support
- No build tools or dependencies required

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start organizing your tasks!

### File Structure
```
smart-todo-app/
├── index.html          # Main HTML structure
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This documentation
```

## 🎯 How to Use

### Adding Tasks
1. Click the "Add Task" button or use Ctrl/Cmd + N
2. Fill in the task details:
   - **Title** (required): Task name
   - **Description** (optional): Additional details
   - **Category**: Choose from Work, Personal, Shopping, or Health
   - **Priority**: Set as Low, Medium, or High
   - **Due Date**: Set when the task should be completed
   - **Reminder**: Schedule a reminder notification
3. Click "Save Task"

### Managing Tasks
- **Complete**: Click the checkmark icon to mark as complete
- **Edit**: Click the edit icon to modify task details
- **Delete**: Click the trash icon to remove tasks
- **Reorder**: Drag and drop tasks to change their order

### Filtering & Search
- **Search Bar**: Type to search through all tasks
- **Category Filters**: Filter by task category
- **Priority Filters**: Filter by priority level
- **Status Filters**: Show pending or completed tasks
- **Combined Filters**: Use multiple filters simultaneously

### Theme Switching
- Click the theme toggle button (moon/sun icon)
- Theme preference is automatically saved
- Respects system dark/light mode preference

## 🎨 Design Features

### Color Scheme
- **Primary**: Indigo (#6366f1)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Danger**: Red (#ef4444)
- **Categories**: Blue, Purple, Amber, Green

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700
- **Responsive Sizing**: Scales appropriately across devices

### Spacing System
- **Consistent Spacing**: 0.25rem to 3rem scale
- **Grid System**: CSS Grid for layout
- **Flexbox**: For component alignment

### Animations
- **Smooth Transitions**: 0.15s to 0.5s duration
- **Hover Effects**: Subtle interactions
- **Modal Animations**: Slide-in effects
- **Notification Animations**: Slide-in from right

## 🔧 Technical Details

### Browser Support
- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **ES6+ Features**: Arrow functions, classes, template literals
- **CSS Grid**: Modern layout system
- **CSS Custom Properties**: CSS variables for theming

### Performance Features
- **Efficient Rendering**: Only re-renders when necessary
- **Event Delegation**: Optimized event handling
- **Local Storage**: Fast data persistence
- **Minimal DOM Manipulation**: Efficient updates

### Accessibility
- **ARIA Labels**: Proper accessibility attributes
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Proper focus handling
- **Screen Reader Support**: Semantic HTML structure

### Security Features
- **XSS Prevention**: HTML escaping for user input
- **Input Validation**: Form validation and sanitization
- **Local Storage Only**: No external data transmission

## 📱 Responsive Breakpoints

### Desktop (1024px+)
- Full sidebar visible
- Grid layout with sidebar and main content
- Hover effects and full feature set

### Tablet (768px - 1023px)
- Sidebar moves below main content
- Single column layout
- Touch-optimized interactions

### Mobile (480px - 767px)
- Collapsible sidebar
- Stacked form elements
- Mobile-first navigation
- Touch-friendly buttons

### Small Mobile (< 480px)
- Optimized spacing
- Full-width buttons
- Simplified layouts

## 🎯 Future Enhancements

### Planned Features
- **Cloud Sync**: Multiple device synchronization
- **Task Templates**: Reusable task patterns
- **Time Tracking**: Pomodoro timer integration
- **Export/Import**: Data portability
- **Collaboration**: Shared task lists
- **Advanced Analytics**: Task completion statistics

### Technical Improvements
- **Service Worker**: Offline functionality
- **IndexedDB**: Larger storage capacity
- **Web Components**: Modular architecture
- **PWA Support**: Installable app experience

## 🤝 Contributing

This is a learning project, but contributions are welcome! Feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Font Awesome**: Icons
- **Google Fonts**: Typography
- **CSS Grid & Flexbox**: Modern layout systems
- **HTML5 Drag & Drop**: Task reordering functionality

---

**Built with ❤️ using vanilla web technologies**

*No frameworks, no build tools, just pure HTML, CSS, and JavaScript!*
