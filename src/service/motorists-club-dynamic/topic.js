import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getMotoristsClub(params, success, fail) {
    axios
      .get(urls.motoristsClubDynamic.motoristsClub, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
