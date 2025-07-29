import { JobBoard } from './JobBoard.js';

// Export the JobBoard class
export { JobBoard };

// For backward compatibility, also expose it on the window object
if (typeof window !== 'undefined') {
    window.JobBoard = JobBoard;
}