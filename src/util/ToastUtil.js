import {toast} from "react-toastify";

export class ToastUtil {

  static showSuccessToast(msg) {
    toast(msg, {
      hideProgressBar: false,
      type: "success"
    });
  }

  static showAlertToast(msg) {
    toast(msg, {
      hideProgressBar: true,
      type: "dark"
    });
  }

  static showErrorToast(msg) {
    toast(msg, {
      hideProgressBar: false,
      type: "error"
    });
  }

  static showWarningToast(msg) {
    toast(msg, {
      hideProgressBar: false,
      type: "warning"
    });
  }

  static showNetworkErrorToast() {
    toast('Something went wrong. Please check your connection!', {
      hideProgressBar: false,
      type: "error"
    });
  }

}
