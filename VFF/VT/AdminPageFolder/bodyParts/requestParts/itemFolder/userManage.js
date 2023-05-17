import {UrlForm, ActionItem, QueryNBodyItem, QueryNBodyItemInfo, TitleItem} from './TAForm';

const url1 = new UrlForm('관리자기능', 1);

url1.addAction(new ActionItem(new TitleItem(2, '/info/admin', '권한부여', '유저에게 권한을 부여하는 기능', 0)));
url1.pushBodyItem(new QueryNBodyItem('code', new QueryNBodyItemInfo('실행변수', 'int', '1', true, '1'), true));
url1.pushBodyItem(new QueryNBodyItem('userid', new QueryNBodyItemInfo('부여할 유저 ID', 'String', '-', false, ''), true));
url1.pushBodyItem(new QueryNBodyItem('changeauth', new QueryNBodyItemInfo('부여권한', 'String', "'x' - 없음, 'p' - 매니저", false, ''), true));

url1.addAction(new ActionItem(new TitleItem(2, '/info/admin', '이름변경', '유저 이름을 변경하는 기능', 1)));
url1.pushBodyItem(new QueryNBodyItem('code', new QueryNBodyItemInfo('실행변수', 'int', '2', true, '2'), true));
url1.pushBodyItem(new QueryNBodyItem('userid', new QueryNBodyItemInfo('수정할 유저 ID', 'String', '-', false, ''), true));
url1.pushBodyItem(new QueryNBodyItem('changename', new QueryNBodyItemInfo('변경할 이름', 'String', "-", false, ''), true));

url1.addAction(new ActionItem(new TitleItem(2, '/info/admin', '유저정지', '유저를 정지하는 기능', 2)));
url1.pushBodyItem(new QueryNBodyItem('code', new QueryNBodyItemInfo('실행변수', 'int', '3', true, '3'), true));
url1.pushBodyItem(new QueryNBodyItem('targetid', new QueryNBodyItemInfo('정지할 유저 ID', 'String', '-', false, ''), true));
url1.pushBodyItem(new QueryNBodyItem('bantype', new QueryNBodyItemInfo('정지타입', 'String', "'x' - 정지해제, 'p' - 영구정지", false, ''), true));
url1.pushBodyItem(new QueryNBodyItem('because', new QueryNBodyItemInfo('정지사유', 'String', '-', false, ''), false));

url1.addAction(new ActionItem(new TitleItem(0, '/chat/game', '채팅확인', '채팅을 확인하는 기능', 3)));
url1.pushQueryItem(new QueryNBodyItem('user', new QueryNBodyItemInfo('유저 ID', 'String', "'___' - 구분자, '=' - 추가, '-' - 제외", false, ''), false));
url1.pushQueryItem(new QueryNBodyItem('content', new QueryNBodyItemInfo('채팅내용', 'String', "'___' - 구분자, '=' - 추가, '-' - 제외", false, ''), false));
url1.pushQueryItem(new QueryNBodyItem('cmd', new QueryNBodyItemInfo('채팅타입', 'String', "'/lobby' - 로비,'/room' - 채팅방 , '/w' - 귓속말", false, ''), false));
url1.pushQueryItem(new QueryNBodyItem('opt', new QueryNBodyItemInfo('채팅옵션', 'String', "'/lobby' - 없음, '/room' - 방 제목, '/w' - 귓속말 상대", false, ''), false));
url1.pushQueryItem(new QueryNBodyItem('start', new QueryNBodyItemInfo('시간(시작)', 'Date', "ex) 2000-01-01 01:00:00", false, ''), false));
url1.pushQueryItem(new QueryNBodyItem('end', new QueryNBodyItemInfo('시간(끝)', 'Date', "ex) 2022-01-01 01:00:00", false, ''), false));
url1.pushQueryItem(new QueryNBodyItem('order', new QueryNBodyItemInfo('정렬순서', 'int', "0 - default, 1 - 변경 시간 우선", false, ''), false));


export default url1;