import { Button, Form, Input, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import "../../libs/i18n"
import { useTranslation } from 'react-i18next';

const SecurityModal = ({
    openSecurityModal,
    onCancelSecurityModal,
    onFinishSecurity,
    loadingSecurity,
    timeCounter
}) => {

    const { t } = useTranslation();

    const [security] = Form.useForm();
    const [timerCounter, setTimerCounter] = useState(0);
    const [isCounting, setIsCounting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Định dạng thời gian kiểu 00:45
    const formatCountdown = (time) => {
        const minutes = Math.floor(time / 60).toString().padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    // Định dạng thời gian kiểu text
    const formatTimeText = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes} ${t('content.modal.2fa.form.minutes')} ${seconds} ${t('content.modal.2fa.form.seconds')}`;
    };

    // Bắt đầu đếm ngược
    const startCountdown = (seconds) => {
        setTimerCounter(seconds);
        setIsCounting(true);

        const interval = setInterval(() => {
            setTimerCounter((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsCounting(false);
                    setErrorMessage('');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Khi user submit
    const handleFinish = (values) => {
        onFinishSecurity(values);
        startCountdown(timeCounter || 60); // Default 60s
        security.resetFields();
    };

    // Cập nhật cảnh báo
    useEffect(() => {
        if (isCounting && timerCounter > 0) {
            setErrorMessage(`${t('content.modal.2fa.form.warning')} ${formatTimeText(timerCounter)}.`);
        }
    }, [timerCounter, isCounting]);

    // Reset khi modal đóng
    const handleCancel = () => {
        security.resetFields();
        setTimerCounter(0);
        setIsCounting(false);
        setErrorMessage('');
        onCancelSecurityModal();
    };

    return (
        <>
            <Modal
                open={openSecurityModal}
                centered
                maskClosable={false}
                closable={false}
                footer={null}
                width={{
                    xs: '90%',
                    sm: '70%',
                    md: '60%',
                    lg: '45%',
                    xl: '35%',
                    xxl: '29%',
                }}
                className='modal-auth'
                onCancel={handleCancel}
            >
                <div>
                    <div className='desc'>
                        <h4>{t('content.modal.2fa.title')}</h4>
                        <p>{t('content.modal.2fa.description')}</p>
                        <img
                            src="/banner-v2.jpg"
                            width="100%"
                            style={{ borderRadius: "10px", margin: "15px auto 35px auto" }}
                            alt=""
                        />
                    </div>

                    <Form
                        name="form-authentication"
                        initialValues={{ remember: true }}
                        onFinish={handleFinish}
                        autoComplete="off"
                        form={security}
                    >
                        <Form.Item
                            name="twoFa"
                            rules={[
                                {
                                    required: true,
                                    message: t('content.modal.2fa.form.required'),
                                },
                            ]}
                            validateStatus={errorMessage ? "error" : ""}
                            help={errorMessage}
                        >
                            <Input
                                type='number'
                                onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key)) e.preventDefault();
                                    if (e.target.value.length >= 8) e.preventDefault();
                                }}
                                placeholder={t('content.modal.2fa.form.placeholder')}
                                maxLength={8}
                                disabled={isCounting} // chỉ disable khi đang đếm
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                className='ant-submit-button button-send'
                                htmlType="submit"
                                loading={loadingSecurity}
                                disabled={isCounting}
                            >
                                {loadingSecurity ? "" : t('content.modal.2fa.form.button')}
                            </Button>

                            {/* ✅ Hiển thị countdown ngay bên dưới */}
                            {isCounting && (
                                <div style={{
                                    marginTop: 8,
                                    color: '#888',
                                    fontSize: 13,
                                    textAlign: 'center'
                                }}>
                                    ⏳ {t('content.modal.2fa.form.resend_in')} {formatCountdown(timerCounter)}
                                </div>
                            )}
                        </Form.Item>
                    </Form>
                </div>

                <div className="modal-footer">
                    <div className='logo'>
                        <svg width="329" height="66" viewBox="0 0 329 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_4111_993)">
                                <path d="M122.064 1.98657H134.372L155.298 39.8132L176.224 1.98657H188.264V64.1421H178.22V16.5033L159.875 49.4881H150.453L132.108 16.5026V64.1414H122.064V1.98657Z" fill="#66778A"></path>
                                <path d="M221.273 65.2542C216.624 65.2542 212.531 64.2213 209.009 62.1693C205.488 60.1101 202.741 57.2629 200.766 53.621C198.799 49.9798 197.816 45.8099 197.816 41.0988C197.816 36.3376 198.777 32.1176 200.701 28.4466C202.625 24.7764 205.3 21.9074 208.72 19.8336C212.141 17.7678 216.074 16.727 220.514 16.727C224.932 16.727 228.728 17.7744 231.91 19.8554C235.099 21.9437 237.55 24.8701 239.264 28.6275C240.985 32.3849 241.845 36.7923 241.845 41.8578V44.6107H207.766C208.387 48.3971 209.921 51.381 212.364 53.5563C214.809 55.731 217.896 56.8147 221.628 56.8147C224.621 56.8147 227.195 56.3745 229.357 55.4855C231.519 54.5965 233.551 53.2527 235.446 51.4463L240.775 57.9711C235.475 62.8267 228.974 65.2542 221.273 65.2542Z" fill="#66778A"></path>
                            </g>
                            <defs>
                                <clipPath id="clip0_4111_993">
                                    <rect width="329" height="66" fill="white"></rect>
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default SecurityModal
