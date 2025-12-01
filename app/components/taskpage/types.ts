// components/taskpage/types.ts

export interface Attachment {
    type: 'image' | 'file';
    url: string;
    name: string;
}

export interface Task {
    id: number;
    subject: string;
    lecturer: string;
    title: string;
    deadlineDate: string;
    deadlineTime: string;
    description: string;
    status: 'pending' | 'completed';
    submissionLink?: string;
    attachments?: Attachment[];
}