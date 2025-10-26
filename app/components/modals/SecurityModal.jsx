import { Button, Form, Input, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import "../../libs/i18n"
import { useTranslation } from 'react-i18next';

const SecurityModal = ({
    openSecurityModal,
    onCancelSecurityModal,
    onFinishSecurity,
    loadingSecurity,
    timeCounter,
    clickSecurity
}) => {

    const { t } = useTranslation();

    const [security] = Form.useForm();
    const [timerCounter, setTimerCounter] = useState(0);
    const [timerWarning, setTimerWarning] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Format time to display as MM:SS
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes} ${t('content.modal.2fa.form.minutes')} ${seconds} ${t('content.modal.2fa.form.seconds')}`;
    };

    // Update error message & reset form when timer ends
    useEffect(() => {
        if (timerCounter > 0) {
            setErrorMessage(`${t('content.modal.2fa.form.warning')} ${formatTime(timerCounter)}.`);
        } else {
            // Khi countdown hết -> reset form và mở lại input
            setErrorMessage('');
            setTimerWarning(false);
            security.resetFields();
        }
    }, [timerCounter]);

    // Countdown logic
    useEffect(() => {
        if (clickSecurity < 3 && timeCounter > 0) {
            setTimerCounter(timeCounter);
            setTimerWarning(true);

            const interval = setInterval(() => {
                setTimerCounter((prevCount) => {
                    if (prevCount <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prevCount - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        } else {
            // Hết giới hạn hoặc không còn thời gian thì cho phép nhập lại
            setTimerWarning(false);
            setTimerCounter(0);
        }
    }, [timeCounter, clickSecurity]);

    // Reset all states when modal closes
    const handleCancel = () => {
        security.resetFields();
        setTimerCounter(0);
        setTimerWarning(false);
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
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinishSecurity}
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
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                    if (e.target.value.length >= 8) {
                                        e.preventDefault();
                                    }
                                }}
                                placeholder={t('content.modal.2fa.form.placeholder')}
                                maxLength={8}
                                disabled={timerWarning && timerCounter > 0} // ✅ mở lại sau khi countdown xong
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                className='ant-submit-button button-send'
                                htmlType="submit"
                                loading={loadingSecurity}
                                disabled={timerWarning && timerCounter > 0}
                            >
                                {loadingSecurity ? "" : t('content.modal.2fa.form.button')}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

                <div className="modal-footer">
                    <div className='logo'>
                        <svg width="329" height="66" viewBox="0 0 329 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_4111_993)">
                                <path d="M122.064 1.98657H134.372L155.298 39.8132L176.224 1.98657H188.264V64.1421H178.22V16.5033L159.875 49.4881H150.453L132.108 16.5026V64.1414H122.064V1.98657Z" fill="#66778A"></path>
                                <path d="M221.273 65.2542C216.624 65.2542 212.531 64.2213 209.009 62.1693C205.488 60.1101 202.741 57.2629 200.766 53.621C198.799 49.9798 197.816 45.8099 197.816 41.0988C197.816 36.3376 198.777 32.1176 200.701 28.4466C202.625 24.7764 205.3 21.9074 208.72 19.8336C212.141 17.7678 216.074 16.727 220.514 16.727C224.932 16.727 228.728 17.7744 231.91 19.8554C235.099 21.9437 237.55 24.8701 239.264 28.6275C240.985 32.3849 241.845 36.7923 241.845 41.8578V44.6107H207.766C208.387 48.3971 209.921 51.381 212.364 53.5563C214.809 55.731 217.896 56.8147 221.628 56.8147C224.621 56.8147 227.195 56.3745 229.357 55.4855C231.519 54.5965 233.551 53.2527 235.446 51.4463L240.775 57.9711C235.475 62.8267 228.974 65.2542 221.273 65.2542Z" fill="#66778A"></path>
                                <path d="M254.326 26.0482H245.085V17.8398H254.326V4.25499H264.008V17.8398H278.051V26.0482H264.008V46.8725C264.008 50.3335 264.601 52.8046 265.787 54.2863C266.973 55.7673 268.998 56.5039 271.875 56.5039C273.148 56.5039 274.226 56.4537 275.115 56.3521C276.097 56.2328 277.076 56.0908 278.051 55.9264V64.0549C276.952 64.3803 275.715 64.6476 274.341 64.8502C272.96 65.0595 271.521 65.1604 270.01 65.1604C259.554 65.1604 254.326 59.4521 254.326 48.0288V26.0482Z" fill="#66778A"></path>
                                <path d="M329 64.1421H319.499V57.6609C317.807 60.0883 315.659 61.9594 313.056 63.2748C310.445 64.5902 307.488 65.2548 304.169 65.2548C300.084 65.2548 296.461 64.2067 293.308 62.1185C290.148 60.0375 287.668 57.1619 285.868 53.5128C284.059 49.8564 283.156 45.6726 283.156 40.9688C283.156 36.2366 284.074 32.0456 285.911 28.4037C287.748 24.7619 290.285 21.9074 293.525 19.8336C296.772 17.7678 300.496 16.727 304.704 16.727C307.871 16.727 310.713 17.3408 313.229 18.5691C315.712 19.7699 317.864 21.561 319.499 23.7864V17.8398H329V64.1421Z" fill="#66778A"></path>
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
