const express = require('express');
const router = express.Router();
const infoAdminFunction = require('./MET/infoAdmin');
const infoFunction = require('./MET/info');
const communityFunction = require('./MET/community');

/*
{
    admin
        body
            table: 바디에 테이블명 삽입
            condition: 바디에 테이블에서 삭제할 조건 삽입

    out 현재 로그인중인 아이디 삭제
        body
            pw: 비밀번호

    seceision
        body
            secessionid: 탈퇴시킬 ID
}
*/
router.delete('/info/:target', (req, res)=>{ 
    let target_id = req.params.target;

    if(target_id === 'admin'){
        infoAdminFunction.info_admin_delete_f(req, res);
    } else if(target_id === 'out'){
        infoFunction.delete_info_f(req, res);
    } else if(target_id === 'seceision'){
        infoAdminFunction.info_admin_delete_target_f(req, res);
    } else{
        res.status(400).send({
                result: '잘못된 URL 파라미터 값을 입력했습니다.',
                cose: 400
            }
        );
    }
});

/*
board
    query
        bindex: 삭제할 글번호(권한이 있어야함)
follow
    query
        bindex: 팔로우를 해제할 ID를 글번호로 추적해서 제거
        targetId: 팔로우를 해제할 ID
block
    query
        bindex: 차단을 해제할 ID를 글번호로 추적해서 제거
        targetId: 차단을 해제할 ID
comment
    query
        cindex: 삭제할 댓글번호(권한이 있어야함)
*/
router.delete('/community/:target', (req, res)=>{
    let target_id = req.params.target;

    if(target_id === 'board'){
        communityFunction.delete_board_f(req, res);
    } else if(target_id === 'follow'){
        communityFunction.delete_follow_f(req, res);
    } else if(target_id === 'block'){
        communityFunction.delete_block_f(req, res);
    } else if(target_id === 'comment'){
        communityFunction.delete_comment_f(req, res);
    } else{
        res.status(400).send({
                result: '잘못된 URL 파라미터 값을 입력했습니다.',
                cose: 400
            }
        );
    }
});

module.exports = router;