/* HORD 官网反馈页 — feedback.js
 * 当前使用 mailto: 兜底，无需后端即可工作。
 * TODO：如后续接入 Cloudflare Worker / Supabase，替换此处的 mailto 逻辑即可。
 */
(function () {
  'use strict';

  // 反馈收件邮箱。上线前请替换为真实邮箱；如暂无邮箱，可改为 # 并隐藏表单。
  const FEEDBACK_EMAIL = 'feedback@hord.asia';

  const form = document.getElementById('fb-form');
  const thanks = document.getElementById('fb-thanks');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fd = new FormData(form);
    const name = (fd.get('name') || '').trim();
    const contact = (fd.get('contact') || '').trim();
    const type = fd.get('type') || '其他';
    const message = (fd.get('message') || '').trim();

    if (!message) {
      const textarea = form.querySelector('[name="message"]');
      if (textarea) {
        textarea.focus();
        textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const subject = encodeURIComponent('[HORD 反馈] ' + type);
    const bodyLines = [
      '【反馈类型】' + type,
      '【称呼】' + (name || '未填写'),
      '【联系方式】' + (contact || '未填写'),
      '',
      '【反馈内容】',
      message,
      '',
      '---',
      '来源：HORD 官网反馈页',
      'User-Agent：' + navigator.userAgent,
    ];
    const body = encodeURIComponent(bodyLines.join('\n'));

    const mailtoUrl = 'mailto:' + FEEDBACK_EMAIL + '?subject=' + subject + '&body=' + body;

    // 尝试打开邮件客户端
    window.location.href = mailtoUrl;

    // 显示感谢提示
    if (thanks) {
      form.setAttribute('hidden', '');
      thanks.removeAttribute('hidden');
      thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();
