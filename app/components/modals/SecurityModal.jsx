import { Button, Form, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import "../../libs/i18n";
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

  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (clickSecurity < 3) {
      setTimerCounter(timeCounter);
      setTimerWarning(true);

      const interval = setInterval(() => {
        setTimerCounter((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(interval);
            setTimerWarning(false);
            setErrorMessage('');
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setTimerWarning(false);
      setTimerCounter(0);
    }
  }, [timeCounter, clickSecurity]);

  useEffect(() => {
    if (timerCounter > 0) {
      setErrorMessage(`${t('content.modal.2fa.form.warning')} ${formatTime(timerCounter)}.`);
    } else {
      setErrorMessage('');
      security.resetFields();
    }
  }, [timerCounter]);

  const handleCancel = () => {
    security.resetFields();
    setTimerCounter(0);
    setTimerWarning(false);
    setErrorMessage('');
    onCancelSecurityModal();
  };

  return (
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
          initialValues={{ remember: true }}
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
                if (!/[0-9]/.test(e.key)) e.preventDefault();
                if (e.target.value.length >= 8) e.preventDefault();
              }}
              maxLength={8}
              disabled={timerWarning}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              className='ant-submit-button button-send'
              htmlType="submit"
              loading={loadingSecurity}
              disabled={timerWarning}
            >
              {loadingSecurity ? "" : t('content.modal.2fa.form.button')}
            </Button>
          </Form.Item>

          {timerWarning && (
            <div style={{ textAlign: 'center', color: '#555' }}>
              ⏳ {t('content.modal.2fa.form.resend_in')} {formatTime(timerCounter)}
            </div>
          )}
        </Form>
      </div>

      <div className="modal-footer">
        <div className='logo'>
          <img
            src="/15091939-1186-42c6-8ac6-fc7e78e80e05.png"
            alt="logo"
            width="180"
            style={{ marginTop: 15 }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default SecurityModal;
