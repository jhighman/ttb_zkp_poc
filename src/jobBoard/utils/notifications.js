// Notifications Utility
// This utility provides functions for displaying notifications and error messages

/**
 * JobBoardNotifications - Utility for displaying notifications in the job board
 */
class JobBoardNotifications {
    /**
     * Show a notification message
     * @param {string} message - The message to display
     * @param {string} type - The type of notification ('success', 'error', 'info', 'warning')
     * @param {number} duration - Duration in milliseconds to show the notification
     */
    static showNotification(message, type = 'info', duration = 5000) {
        // Create notification container if it doesn't exist
        let notificationContainer = document.getElementById('job-board-notifications');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'job-board-notifications';
            notificationContainer.className = 'fixed top-4 right-4 z-50 flex flex-col items-end space-y-2';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification glass-card rounded-lg p-4 shadow-lg transform transition-all duration-300 ease-in-out max-w-md';
        
        // Add type-specific styling
        switch (type) {
            case 'success':
                notification.className += ' border-l-4 border-neon-green text-neon-green';
                break;
            case 'error':
                notification.className += ' border-l-4 border-red-500 text-red-400';
                break;
            case 'warning':
                notification.className += ' border-l-4 border-yellow-500 text-yellow-400';
                break;
            case 'info':
            default:
                notification.className += ' border-l-4 border-neon-blue text-neon-blue';
                break;
        }
        
        // Create notification content
        const content = document.createElement('div');
        content.className = 'flex items-start';
        
        // Icon based on type
        const icon = document.createElement('div');
        icon.className = 'mr-3 text-lg';
        switch (type) {
            case 'success':
                icon.textContent = '✓';
                break;
            case 'error':
                icon.textContent = '✗';
                break;
            case 'warning':
                icon.textContent = '⚠';
                break;
            case 'info':
            default:
                icon.textContent = 'ℹ';
                break;
        }
        content.appendChild(icon);
        
        // Message
        const messageElement = document.createElement('div');
        messageElement.className = 'flex-1';
        messageElement.textContent = message;
        content.appendChild(messageElement);
        
        // Close button
        const closeButton = document.createElement('button');
        closeButton.className = 'ml-3 text-blue-300 hover:text-white';
        closeButton.textContent = '×';
        closeButton.addEventListener('click', () => {
            notification.classList.add('opacity-0', 'scale-95');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        content.appendChild(closeButton);
        
        notification.appendChild(content);
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Initial animation
        notification.classList.add('opacity-0', 'scale-95', 'translate-y-2');
        setTimeout(() => {
            notification.classList.remove('opacity-0', 'scale-95', 'translate-y-2');
        }, 10);
        
        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                notification.classList.add('opacity-0', 'scale-95');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, duration);
        }
        
        return notification;
    }
    
    /**
     * Show an error message
     * @param {string} message - The error message to display
     * @param {number} duration - Duration in milliseconds to show the notification
     */
    static showError(message, duration = 5000) {
        return this.showNotification(message, 'error', duration);
    }
    
    /**
     * Show a success message
     * @param {string} message - The success message to display
     * @param {number} duration - Duration in milliseconds to show the notification
     */
    static showSuccess(message, duration = 5000) {
        return this.showNotification(message, 'success', duration);
    }
    
    /**
     * Show a warning message
     * @param {string} message - The warning message to display
     * @param {number} duration - Duration in milliseconds to show the notification
     */
    static showWarning(message, duration = 5000) {
        return this.showNotification(message, 'warning', duration);
    }
    
    /**
     * Show an info message
     * @param {string} message - The info message to display
     * @param {number} duration - Duration in milliseconds to show the notification
     */
    static showInfo(message, duration = 5000) {
        return this.showNotification(message, 'info', duration);
    }
}

// Export the JobBoardNotifications class
window.JobBoardNotifications = JobBoardNotifications;

// Log that the notifications utility is loaded
console.log('JobBoard notifications utility loaded');