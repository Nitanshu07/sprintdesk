import { beforeEach, describe, expect, it } from 'vitest';
import { useToast } from '../useToast';
describe('useToast', () => { beforeEach(() => useToast.setState({ toasts: [] })); it('shows and dismisses a toast', () => { const id = useToast.getState().show('Saved'); expect(useToast.getState().toasts[0].message).toBe('Saved'); useToast.getState().dismiss(id); expect(useToast.getState().toasts).toHaveLength(0); }); });
