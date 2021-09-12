import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const ConfirmModal = (props) => {
  const modalRef = useRef<any>();

  useEffect(() => {
    (window as any).$(modalRef.current).modal('show');
    (window as any)
      .$(modalRef.current)
      .on('hidden.bs.modal', props.onClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onConfirm = () => {
    (window as any).$(modalRef.current).modal('hide');
    return props.onConfirm();
  };

  return ReactDOM.createPortal(
    <div ref={modalRef} className="modal" tabIndex={-1}>
      <div className="modal-dialog modal-sm">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{props.title}</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
            >
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light btn-sm"
              data-dismiss="modal"
            >
              {props.cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="btn btn-primary btn-sm"
            >
              {props.okText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    (document as any).getElementById('modal-root'),
  );
};

export default ConfirmModal;
