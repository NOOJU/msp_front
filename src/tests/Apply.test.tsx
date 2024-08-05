import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import Apply from '../routes/Apply/Apply';

let container: HTMLElement;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
});

test('renders Apply component', () => {
    act(() => {
        ReactDOM.render(
            <Router>
                <Apply />
            </Router>,
            container
        );
    });
    const title = container.querySelector('h1');
    expect(title?.textContent).toBe('VM 신청');
});

test('submits form successfully', async () => {
    // fetch API를 모킹하여 응답을 설정합니다.
    globalThis.fetch = async () => new Response(JSON.stringify({ message: '신청이 성공적으로 제출되었습니다.' }), {
        status: 200,
        headers: { 'Content-type': 'application/json' }
    });

    await act(async () => {
        ReactDOM.render(
            <Router>
                <Apply />
            </Router>,
            container
        );
    });

    const usageInput = container.querySelector('input[name="usage"]') as HTMLInputElement;
    const startDateInput = container.querySelector('input[name="startDate"]') as HTMLInputElement;
    const volumeInput = container.querySelector('input[name="volume"]') as HTMLInputElement;
    const securityGroupInput = container.querySelector('input[name="securityGroup"]') as HTMLInputElement;
    const agreementCheckbox = container.querySelector('input[name="agreement"]') as HTMLInputElement;
    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;

    if (usageInput && startDateInput && volumeInput && securityGroupInput && agreementCheckbox && submitButton) {
        await act(async () => {
            usageInput.value = '테스트 용도';
            usageInput.dispatchEvent(new Event('input', { bubbles: true }));

            startDateInput.value = '2024-08-05';
            startDateInput.dispatchEvent(new Event('input', { bubbles: true }));

            volumeInput.value = '100GB';
            volumeInput.dispatchEvent(new Event('input', { bubbles: true }));

            securityGroupInput.value = 'default';
            securityGroupInput.dispatchEvent(new Event('input', { bubbles: true }));

            agreementCheckbox.checked = true;
            agreementCheckbox.dispatchEvent(new Event('change', { bubbles: true }));

            submitButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        const alert = jest.spyOn(window, 'alert').mockImplementation(() => {});
        expect(alert).toHaveBeenCalledWith('신청이 성공적으로 제출되었습니다.');
    }
});
