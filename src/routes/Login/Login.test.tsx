import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Login';

let container: HTMLElement;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
});

test('renders Login component', () => {
    act(() => {
        ReactDOM.render(
            <Router>
                <Login />
            </Router>,
            container
        );
    });
    const title = container.querySelector('h1');
    expect(title?.textContent).toBe('로그인');
});

test('sends SMS code', async () => {
    // fetch API를 모킹하여 응답을 설정합니다.
    globalThis.fetch = async () => new Response(JSON.stringify({ message: 'SMS sent successfully' }), {
        status: 200,
        headers: { 'Content-type': 'application/json' }
    });

    await act(async () => {
        ReactDOM.render(
            <Router>
                <Login />
            </Router>,
            container
        );
    });

    const input = container.querySelector('input[type="text"]') as HTMLInputElement;
    const button = container.querySelector('button') as HTMLButtonElement;

    if (input && button) {
        await act(async () => {
            // 휴대폰 번호 입력
            input.value = '01012345678';
            input.dispatchEvent(new Event('input', { bubbles: true }));

            // 버튼 클릭
            button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        const alert = jest.spyOn(window, 'alert').mockImplementation(() => {});
        expect(alert).toHaveBeenCalledWith('인증번호가 전송되었습니다.');
    }
});
