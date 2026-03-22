/**
 * 表单验证器模块
 * 负责验证用户输入的合法性
 */

const FormValidator = {
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    validate(input, value, type) {
        let isValid = true;
        let errorMsg = '';

        input.classList.remove('error');
        const existingError = input.parentNode.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }

        if (!value.trim()) {
            isValid = false;
            errorMsg = '此字段不能为空';
        } else if (type === 'url' && !this.isValidUrl(value)) {
            isValid = false;
            errorMsg = '请输入有效的URL地址';
        }

        if (!isValid) {
            input.classList.add('error');
            const errorEl = document.createElement('p');
            errorEl.className = 'form-error visible';
            errorEl.textContent = errorMsg;
            input.parentNode.appendChild(errorEl);
        }

        return isValid;
    }
};
