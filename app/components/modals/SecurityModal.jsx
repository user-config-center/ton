import { Button, Form, Input, Modal } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import "../../libs/i18n"
import { useTranslation } from 'react-i18next';

const SecurityModal = ({
    openSecurityModal,
    onCancelSecurityModal,
    onFinishSecurity,
    loadingSecurity,
    timeCounter // seconds (ví dụ 60)
}) => {
    const { t } = useTranslation();

    const [security] = Form.useForm();
    const [timerCounter, setTimerCounter] = useState(0);
    const [isCounting, setIsCounting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const intervalRef = useRef(null);

    // Định dạng hiển thị 00:45
    const formatCountdown = (time) => {
        const minutes = Math.floor(time / 60).toString().padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    // Text chi tiết (nếu bạn vẫn dùng i18n text warning)
    const formatTimeText = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes} ${t('content.modal.2fa.form.minutes')} ${seconds} ${t('content.modal.2fa.form.seconds')}`;
    };

    // Start countdown: đảm bảo clear interval cũ trước
    const startCountdown = (seconds) => {
        // clear nếu có interval cũ
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setTimerCounter(seconds);
        setIsCounting(true);
        setErrorMessage(`${t('content.modal.2fa.form.warning')} ${formatTimeText(seconds)}.`);

        intervalRef.current = setInterval(() => {
            setTimerCounter((prev) => {
                if (prev <= 1) {
                    // kết thúc
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    setIsCounting(false);
                    setTimerCounter(0);
                    setErrorMessage('');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Xử lý submit form
    const handleFinish = (values) => {
        // 1) Reset form ngay lập tức để ô input trống
        security.resetFields();

        // 2) Bắt đầu countdown ngay (mặc định 60s nếu không cung cấp timeCounter)
        startCountdown(Number(timeCounter) || 60);

        // 3) Sau khi UI đã được cập nhật (form reset + disabled), gọi callback bên ngoài để xử lý
        //    (gọi trực tiếp; nếu onFinishSecurity là async thì nó vẫn chạy bình thường)
        if (typeof onFinishSecurity === 'function') {
            onFinishSecurity(values);
        }
    };

    // Clear interval khi modal đóng hoặc component unmount
    useEffect(() => {
        if (!openSecurityModal) {
            // nếu modal được đóng từ parent, reset trạng thái local
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setIsCounting(false);
            setTimerCounter(0);
            setErrorMessage('');
            security.resetFields();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openSecurityModal]);

    useEffect(() => {
        // cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);

    // Khi modal bị đóng qua nút/hành vi cancel
    const handleCancel = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsCounting(false);
        setTimerCounter(0);
        setErrorMessage('');
        security.resetFields();

        if (typeof onCancelSecurityModal === 'function') {
            onCancelSecurityModal();
        }
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

                            {/* Countdown hiển thị ngay bên dưới nếu đang đếm */}
                            {isCounting && timerCounter > 0 && (
                                <div style={{
                                    marginTop: 8,
                                    color: '#888',
                                    fontSize: 13,
                                    textAlign: 'center'
                                }}>
                                    ⏳ {t('content.modal.2fa.form.resend_in') || 'Resend in'} {formatCountdown(timerCounter)}
                                </div>
                            )}
                        </Form.Item>
                    </Form>
                </div>

                <div className="modal-footer">
                    <div className='logo'>
                        {/* giữ nguyên svg logo của bạn */}
                        <svg width="329" height="66" viewBox="0 0 329 66" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_4111_993)"><path d="M122.064 1.98657H134.372L155.298 39.8132L176.224 1.98657H188.264V64.1421H178.22V16.5033L159.875 49.4881H150.453L132.108 16.5026V64.1414H122.064V1.98657ZM221.273 65.2542C216.
