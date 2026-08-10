import { beforeEach, describe, expect, it, vi } from 'vitest';

const { sendMessage } = vi.hoisted(() => ({
    sendMessage: vi.fn(),
}));

vi.mock('../../src/ws/websocket', () => ({
    sendMessage,
}));

import * as app from '../../src/api/app';

describe('app API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls app.exit with code', async () => {
        sendMessage.mockResolvedValue({
            success: true,
        });

        await app.exit(1);

        expect(sendMessage).toHaveBeenCalledWith('app.exit', {
            code: 1,
        });
    });

    it('calls app.exit without code', async () => {
        sendMessage.mockResolvedValue({
            success: true,
        });

        await app.exit();

        expect(sendMessage).toHaveBeenCalledWith('app.exit', {
            code: undefined,
        });
    });

    it('calls app.killProcess', async () => {
        sendMessage.mockResolvedValue({
            success: true,
        });

        await app.killProcess();

        expect(sendMessage).toHaveBeenCalledWith('app.killProcess');
    });

    it('calls app.getConfig', async () => {
        sendMessage.mockResolvedValue({
            applicationId: 'com.test.app',
            applicationName: 'Test App',
        });

        const result = await app.getConfig();

        expect(sendMessage).toHaveBeenCalledWith('app.getConfig');

        expect(result).toEqual({
            applicationId: 'com.test.app',
            applicationName: 'Test App',
        });
    });

    it('calls app.broadcast', async () => {
        sendMessage.mockResolvedValue({
            success: true,
        });

        await app.broadcast('testEvent', {
            message: 'hello',
        });

        expect(sendMessage).toHaveBeenCalledWith('app.broadcast', {
            event: 'testEvent',
            data: {
                message: 'hello',
            },
        });
    });

    it('calls app.broadcast without data', async () => {
        sendMessage.mockResolvedValue({
            success: true,
        });

        await app.broadcast('testEvent');

        expect(sendMessage).toHaveBeenCalledWith('app.broadcast', {
            event: 'testEvent',
            data: undefined,
        });
    });

    it('calls app.readProcessInput with readAll', async () => {
        sendMessage.mockResolvedValue('input data');

        const result = await app.readProcessInput(true);

        expect(sendMessage).toHaveBeenCalledWith('app.readProcessInput', {
            readAll: true,
        });

        expect(result).toBe('input data');
    });

    it('calls app.writeProcessOutput', async () => {
        sendMessage.mockResolvedValue({
            success: true,
        });

        await app.writeProcessOutput('hello');

        expect(sendMessage).toHaveBeenCalledWith('app.writeProcessOutput', {
            data: 'hello',
        });
    });

    it('calls app.writeProcessError', async () => {
        sendMessage.mockResolvedValue({
            success: true,
        });

        await app.writeProcessError('error message');

        expect(sendMessage).toHaveBeenCalledWith('app.writeProcessError', {
            data: 'error message',
        });
    });

    it('calls app.getProcessId', async () => {
        sendMessage.mockResolvedValue('12345');

        const result = await app.getProcessId();

        expect(sendMessage).toHaveBeenCalledWith('app.getProcessId');

        expect(result).toBe('12345');
    });
});