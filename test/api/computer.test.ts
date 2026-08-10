import { describe, expect, it, vi } from 'vitest';
import { SendKeyState } from '../../src/types/enums';

const { sendMessage } = vi.hoisted(() => ({
    sendMessage: vi.fn(),
}));

vi.mock('../../src/ws/websocket', () => ({
    sendMessage,
}));

import * as computer from '../../src/api/computer';

describe('computer API', () => {
    it('calls computer.getMemoryInfo', async () => {
        sendMessage.mockResolvedValue({
            total: 1024,
            available: 512,
        });

        const result = await computer.getMemoryInfo();

        expect(sendMessage).toHaveBeenCalledWith('computer.getMemoryInfo');

        expect(result).toEqual({
            total: 1024,
            available: 512,
        });
    });

    it('calls computer.getArch', async () => {
        sendMessage.mockResolvedValue('x64');

        const result = await computer.getArch();

        expect(sendMessage).toHaveBeenCalledWith('computer.getArch');

        expect(result).toBe('x64');
    });

    it('calls computer.getKernelInfo', async () => {
        sendMessage.mockResolvedValue({
            release: 'test-release',
            version: 'test-version',
        });

        const result = await computer.getKernelInfo();

        expect(sendMessage).toHaveBeenCalledWith('computer.getKernelInfo');

        expect(result).toEqual({
            release: 'test-release',
            version: 'test-version',
        });
    });

    it('calls computer.getOSInfo', async () => {
        sendMessage.mockResolvedValue({
            name: 'Windows',
        });

        const result = await computer.getOSInfo();

        expect(sendMessage).toHaveBeenCalledWith('computer.getOSInfo');

        expect(result).toEqual({
            name: 'Windows',
        });
    });

    it('calls computer.getCPUInfo', async () => {
        sendMessage.mockResolvedValue({
            model: 'Test CPU',
        });

        const result = await computer.getCPUInfo();

        expect(sendMessage).toHaveBeenCalledWith('computer.getCPUInfo');

        expect(result).toEqual({
            model: 'Test CPU',
        });
    });

    it('calls computer.getHostname', async () => {
        sendMessage.mockResolvedValue('test-host');

        const result = await computer.getHostname();

        expect(sendMessage).toHaveBeenCalledWith('computer.getHostname');

        expect(result).toBe('test-host');
    });

    it('calls computer.getMousePosition', async () => {
        sendMessage.mockResolvedValue({
            x: 100,
            y: 200,
        });

        const result = await computer.getMousePosition();

        expect(sendMessage).toHaveBeenCalledWith('computer.getMousePosition');

        expect(result).toEqual({
            x: 100,
            y: 200,
        });
    });

    it('calls computer.setMousePosition', async () => {
        sendMessage.mockResolvedValue({
            success: true,
        });

        await computer.setMousePosition(100, 200);

        expect(sendMessage).toHaveBeenCalledWith('computer.setMousePosition', {
            x: 100,
            y: 200,
        });
    });

    it('calls computer.setMouseGrabbing', async () => {
        sendMessage.mockResolvedValue({
            success: true,
        });

        await computer.setMouseGrabbing(true);

        expect(sendMessage).toHaveBeenCalledWith('computer.setMouseGrabbing', {
            grabbing: true,
        });
    });

    it('calls computer.sendKey', async () => {
        sendMessage.mockResolvedValue({
            success: true,
        });

        await computer.sendKey(65, SendKeyState.down);

        expect(sendMessage).toHaveBeenCalledWith('computer.sendKey', {
            key: 65,
            state: SendKeyState.down,
        });
    });

    it('calls computer.getNetworkInterfaces', async () => {
        sendMessage.mockResolvedValue([]);

        const result = await computer.getNetworkInterfaces();

        expect(sendMessage).toHaveBeenCalledWith(
            'computer.getNetworkInterfaces',
        );

        expect(result).toEqual([]);
    });

    it('calls computer.getMachineId', async () => {
        sendMessage.mockResolvedValue('test-machine-id');

        const result = await computer.getMachineId();

        expect(sendMessage).toHaveBeenCalledWith('computer.getMachineId');

        expect(result).toBe('test-machine-id');
    });
});
