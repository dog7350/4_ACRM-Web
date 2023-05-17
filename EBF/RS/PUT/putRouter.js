const express = require('express');
const router = express.Router();
const infoFunction = require('./MET/info');
const infoAdminFunction = require('./MET/infoAdmin');
const communityFunction = require('./MET/community');
const goodsFunction = require('./MET/goods');

/*
pw, email, name, phone, address
    body
        after: 바꿀 값(비번, 이메일, 이름, 폰번호, 주소)

admin
    body 
        code=0 (테이블 수정)
        table: 수정할 테이블
        colname: 수정할 값
        condition: 조건

    body
        code=1 (권한부여)
        userid: 권한을 바꿀 유저이름
        changeauth: 'm', 'x'

    body
        code=2 (이름 변경)
        userid: 이름을 바꿀 유저 ID
        changename: 바꿀이름

    body
        code=3 (정지, 정지해제)
        targetid: 정지할 유저 ID
        because: 정지사유
        bantype: 정지타입, 'x' 정지해제, 'p' 영구정지
    

*/
router.put('/info/:target', (req, res)=>{ 
    let target_id = req.params.target;

    if(target_id === 'pw'){
        infoFunction.modify_pw_f(req, res);
    } else if(target_id === 'email'){
        infoFunction.modify_email_f(req, res);
    } else if(target_id === 'name'){
        infoFunction.modify_name_f(req, res);
    } else if(target_id === 'phone'){
        infoFunction.modify_phone_f(req, res);
    } else if(target_id === 'address'){
        infoFunction.modify_address_f(req, res);
    } else if(target_id === 'admin' && req.body){
        if(req.body.code === '0'){
            infoAdminFunction.info_admin_update_f(req, res); // 
        } else if(req.body.code === '1'){
            infoAdminFunction.info_admin_authorize_f(req, res); // 
        } else if(req.body.code === '2'){
            infoAdminFunction.info_admin_renamed_f(req, res); // 
        } else if(req.body.code === '3'){
            infoAdminFunction.info_admin_ban_f(req, res); // 
        }else{
            res.status(400).send({
                result: '잘못된 URL 파라미터 값을 입력했습니다.',
                code: 400
            });
        }
    } else{
        res.status(400).send({
            result: '잘못된 URL 파라미터 값을 입력했습니다.',
            code: 400
        });
    }
});


/*
updateStat
    body
        goodsLogNumber: 업데이트할 굿즈 로그 번호
        status: 업데이트할 번호
        message: 추가로 보내고 싶은 메시지
*/
router.put('/goods/:target', (req, res)=>{ 
    let target_id = req.params.target;

    if(target_id === 'updateStat'){
        goodsFunction.update_goods_stat_f(req, res);
    } else{
        res.status(400).send({
            result: '잘못된 URL 파라미터 값을 입력했습니다.',
            code: 400
        });
    }
});

/*
board (글 수정)
    body
        title       : 제목
        content     : 내용
        hideLevel   : 글 공개범위 (0 all, 1 friend,follower, 2 friend, 3 myself)
        type        : 글 종류 (1 none, 2 humor, 3 info, 4 notice <- 관리자만 올릴 수 있음)
        boardIndex : 수정할 글번호(필수)
        imageFiles  : 수정할 이미지 (multipartFormData)
*/
router.put('/community/board', communityFunction.update_board_f);

/*
logo (로고 변경)
    body
        imageFiles: 수정할 로고 이미지 (multipartFormData)
*/
router.put('/community/logo', communityFunction.update_logo_f);

/*
recommend (추천을 두번하면 취소됨)
    body
        isupdate    : 'b'(board) or 'c'(comment)
        index       : 글 또는 댓글 번호
        rtype       : 'o' or 'x' 'o'면 추천함

*/
router.put('/community/recommend', communityFunction.update_recommend_f);

/*
objection (신고는 게시글당 한 번만 가능)
    body
        isupdate        : true(board) or false(comment)
        index           : 글 또는 댓글 번호
        objectiontext   : 신고내용
*/
router.put('/community/objection', communityFunction.update_objection_f);

/*
comment (댓글수정)
    body
        cindex        : 수정할 댓글 번호
        content       : 수정할 댓글 내용
*/
router.put('/community/comment', communityFunction.update_comment_f);

module.exports = router;