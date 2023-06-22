exports.isValidNcknm = function (strNcknm) {
    //아이디 정규식 체크 함수
    const reg2 = /^[A-Za-z0-9]+[A-Za-z0-9]{2,}$/g; //영문+숫자 조합 3자 이상.
    return reg2.test(strNcknm);
  }

exports.isValidPwd = function (strPwd) {
    //비밀번호 정규식 체크 함수
    const reg1 = /^(?=.*[A-Za-z0-9])(?=.*\d)[A-Za-z0-9\d@$!%*#?&]{3,}$/; //비밀번호는 영어/숫자/특수문자를 포함한 4자 이상.
    return reg1.test(strPwd); //정규식과 매치되면 true, 매치되지않으면 false 반환.
  }