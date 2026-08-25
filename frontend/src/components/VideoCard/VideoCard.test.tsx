import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import VideoCard from './VideoCard';

describe('VideoCard Component', () => {
    // Змінили назву тесту, щоб вона відповідала логіці
    it('renders video title and channel name correctly', () => {
        const mockVideo = {
            id: '1',
            title: 'JavaScript Event Loop',
            description: 'Detailed explanation of Event Loop',
            channel_name: 'Tech Channel',
            views: 1500,
            thumbnail_url: 'http://example.com/thumb.jpg',
            posted_at: '2026-08-17T00:00:00Z',
            category: 'Education', // Повернули обов'язкове поле для TypeScript
        };

        render(
            <MemoryRouter>
                <VideoCard video={mockVideo} />
            </MemoryRouter>
        );

        // 3. Assert: Перевіряємо лише те, що ДІЙСНО має бути на картці
        const titleElement = screen.getByText('JavaScript Event Loop');
        const channelElement = screen.getByText('Tech Channel');

        expect(titleElement).toBeInTheDocument();
        expect(channelElement).toBeInTheDocument();
    });
});