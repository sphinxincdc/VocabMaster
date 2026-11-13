(() => {
  'use strict';

  // Public Paddle Billing client-side token. Never put a server API key here.
  const clientToken = 'live_66ae862b9de7696d837eee1f85d';
  const prices = {
    hord: 'pri_01m79gpba5csndsar6z7t9vt2f',
    toolkit: 'pri_01m79grfwd3kk2cmpzb75ej50n'
  };
  const messages = {
    en: {
      loading: 'Opening secure checkout…',
      unavailable: 'Card checkout is currently unavailable. Please use Alipay / WeChat or contact support.',
      error: 'Checkout could not be opened. Please try again, or use Alipay / WeChat or contact support.',
      completed: 'Thank you. After payment verification, your license key will be sent to your checkout email.'
    },
    'zh-CN': {
      loading: '正在打开安全结账…',
      unavailable: '国际付款暂不可用，请使用支付宝 / 微信或联系客服。',
      error: '结账未能打开，请重试，或使用支付宝 / 微信、联系客服。',
      completed: '感谢购买。付款核验后，License Key 将发送至结账时填写的邮箱。'
    },
    'zh-TW': {
      loading: '正在開啟安全結帳…',
      unavailable: '國際付款暫不可用，請使用支付寶 / 微信或聯絡客服。',
      error: '結帳未能開啟，請重試，或使用支付寶 / 微信、聯絡客服。',
      completed: '感謝購買。付款核驗後，License Key 將寄送至結帳時填寫的信箱。'
    }
  };
  const buttons = Array.from(document.querySelectorAll('[data-paddle-product]'));
  const status = document.getElementById('paddleCheckoutStatus');
  let ready;
  let busy = false;
  let completed = false;
  let checkoutTimer;

  function showMessage(key) {
    const copy = messages[document.documentElement.lang] || messages.en;
    if (status) status.textContent = key ? copy[key] : '';
  }

  function unlock() {
    clearTimeout(checkoutTimer);
    busy = false;
    buttons.forEach(button => { button.disabled = false; });
  }

  function onEvent(event) {
    if (event.name === 'checkout.loaded' || event.name === 'checkout.closed') {
      unlock();
      if (!completed) showMessage('');
    } else if (event.name === 'checkout.completed') {
      unlock();
      completed = true;
      showMessage('completed');
    } else if (event.name === 'checkout.error' || event.name === 'checkout.failed' || event.name === 'error') {
      unlock();
      showMessage('error');
    }
  }

  function loadPaddle() {
    if (ready) return ready;
    ready = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const timer = setTimeout(() => {
        script.remove();
        reject(new Error('Paddle load timed out'));
      }, 15000);
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      script.async = true;
      script.onload = () => {
        clearTimeout(timer);
        resolve();
      };
      script.onerror = () => {
        clearTimeout(timer);
        script.remove();
        reject(new Error('Paddle load failed'));
      };
      document.head.appendChild(script);
    }).then(() => {
      window.Paddle.Initialize({ token: clientToken, eventCallback: onEvent });
      return window.Paddle;
    }).catch(error => {
      ready = undefined;
      throw error;
    });
    return ready;
  }

  // Paddle opens the transaction referenced by _ptxn automatically on payment links.
  if (new URLSearchParams(window.location.search).has('_ptxn')) {
    if (clientToken.startsWith('live_')) {
      showMessage('loading');
      loadPaddle().catch(() => showMessage('error'));
    } else {
      showMessage('unavailable');
    }
  }

  buttons.forEach(button => {
    button.addEventListener('click', async () => {
      if (busy) return;
      const priceId = prices[button.dataset.paddleProduct];
      if (!clientToken.startsWith('live_') || !priceId) {
        showMessage('unavailable');
        return;
      }
      busy = true;
      completed = false;
      buttons.forEach(item => { item.disabled = true; });
      showMessage('loading');
      try {
        const paddle = await loadPaddle();
        checkoutTimer = setTimeout(() => {
          unlock();
          showMessage('error');
        }, 20000);
        paddle.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          settings: { displayMode: 'overlay' }
        });
      } catch {
        unlock();
        showMessage('error');
      }
    });
  });
})();
