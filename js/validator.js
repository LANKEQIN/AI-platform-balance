/**
 * 表单验证器模块
 * 负责验证用户输入的合法性
 */

const FormValidator = {
    /**
     * 验证URL格式
     * 支持更多合法的URL格式
     * @param {string} url 要验证的URL
     * @returns {boolean} 是否为有效的URL
     */
    isValidUrl(url) {
        if (!url || typeof url !== 'string') return false;
        
        url = url.trim();
        if (!url) return false;
        
        try {
            // 尝试添加协议前缀
            let urlWithProtocol = url;
            if (!url.match(/^https?:\/\//i) && !url.match(/^\/\//i)) {
                urlWithProtocol = 'https://' + url;
            }
            
            new URL(urlWithProtocol);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * 验证输入
     * @param {HTMLElement} input 输入元素
     * @param {string} value 输入值
     * @param {string} type 验证类型 ('text', 'url', 'email', 'number')
     * @returns {boolean} 是否验证通过
     */
    validate(input, value, type = 'text') {
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
        } else {
            switch (type) {
                case 'url':
                    if (!this.isValidUrl(value)) {
                        isValid = false;
                        errorMsg = '请输入有效的URL地址（如：https://example.com）';
                    }
                    break;
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value.trim())) {
                        isValid = false;
                        errorMsg = '请输入有效的邮箱地址';
                    }
                    break;
                case 'number':
                    if (isNaN(value) || value.trim() === '') {
                        isValid = false;
                        errorMsg = '请输入有效的数字';
                    }
                    break;
                case 'text':
                    if (value.trim().length < 1) {
                        isValid = false;
                        errorMsg = '此字段至少需要1个字符';
                    } else if (value.trim().length > 100) {
                        isValid = false;
                        errorMsg = '此字段不能超过100个字符';
                    }
                    break;
            }
        }

        if (!isValid) {
            input.classList.add('error');
            const errorEl = document.createElement('p');
            errorEl.className = 'form-error visible';
            errorEl.textContent = errorMsg;
            input.parentNode.appendChild(errorEl);
        }

        return isValid;
    },

    /**
     * 清除验证错误
     * @param {HTMLElement} input 输入元素
     */
    clearError(input) {
        input.classList.remove('error');
        const existingError = input.parentNode.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
    },

    /**
     * 批量验证
     * @param {Array} fields 验证字段数组 [{input, value, type}]
     * @returns {Object} 验证结果 { valid: boolean, errors: Array }
     */
    validateMultiple(fields) {
        let valid = true;
        const errors = [];

        fields.forEach(field => {
            if (!this.validate(field.input, field.value, field.type || 'text')) {
                valid = false;
                errors.push({
                    field: field.input,
                    message: field.input.parentNode.querySelector('.form-error')?.textContent
                });
            }
        });

        return { valid, errors };
    }
};
