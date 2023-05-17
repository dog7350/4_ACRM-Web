import {UrlForm, ActionItem, QueryNBodyItem, QueryNBodyItemInfo, TitleItem} from './TAForm';

const url1 = new UrlForm('글, 댓글 조회', 0);

let startDate = new Date();
let endDate = new Date();

startDate.setDate(startDate.getDate() - 30);

startDate = startDate.toISOString().split('.')[0].split('T')[0];
endDate = endDate.toISOString().split('.')[0].split('T')[0];

url1.addAction(new ActionItem(new TitleItem(0, '/community/boards', '글조회', '게시글 조회', 4)));
url1.pushQueryItem(new QueryNBodyItem('page', new QueryNBodyItemInfo('페이지 크기', 'int', 'gte 0', false, '1'), false));
url1.pushQueryItem(new QueryNBodyItem('pagesize', new QueryNBodyItemInfo('페이지 사이즈', 'int', "gte 1", false, '10'), false));
url1.pushQueryItem(new QueryNBodyItem('bIndex', new QueryNBodyItemInfo('검색할 글번호(codef에 따라 검색))', 'int', "없을 경우 int 최대값", false, ''), false));
url1.pushQueryItem(new QueryNBodyItem('bType', new QueryNBodyItemInfo('검색할 글 타입(없으면 10)', 'int', "1 - 잡담, 2 - 유머, 3 - 정보, 4 - 공지, 10 - 전체", false, '10'), false));
url1.pushQueryItem(new QueryNBodyItem('order', new QueryNBodyItemInfo('정렬', 'any', '0이 들어가면 DESC', false, ''), false));
url1.pushQueryItem(new QueryNBodyItem('findStr', new QueryNBodyItemInfo('찾을 문자열', 'String', "기본 '.*'", false, ''), false));
url1.pushQueryItem(new QueryNBodyItem('codef', new QueryNBodyItemInfo('', 'int', '0 - 인덱스이하로 검색, 1 - 닉네임, 2 - 아이디, 3 - follow검색, 4 - 친구검색, 5 - follow 또는 친구 검색, 6 - 팔로우면서 친구', false, ''), false));
url1.pushQueryItem(new QueryNBodyItem('codeo', new QueryNBodyItemInfo('', 'int', '0 - 인덱스로 정렬, 1 - 좋아요로 정렬, 2 - 조회수로 정렬, 3 - 댓글수로 정렬, 4 - 신고수로 정렬(관리자만)', false, ''), false));

url1.addAction(new ActionItem(new TitleItem(0, '/info/admin', '유저글 조회', '유저가 쓴 글 조회', 0)));
url1.pushQueryItem(new QueryNBodyItem('code', new QueryNBodyItemInfo('실행변수', 'int', '0', true, '0'), true));
url1.pushQueryItem(new QueryNBodyItem('id', new QueryNBodyItemInfo('유저 ID', 'String', '-', false, ''), true));
url1.pushQueryItem(new QueryNBodyItem('page', new QueryNBodyItemInfo('페이지 크기', 'int', 'gte 0', false, '1'), false));
url1.pushQueryItem(new QueryNBodyItem('pagesize', new QueryNBodyItemInfo('페이지 사이즈', 'int', "gte 0", false, '10'), false));
url1.pushQueryItem(new QueryNBodyItem('order', new QueryNBodyItemInfo('정렬', 'any', '값이 들어가면 ASC', false, ''), false));

url1.addAction(new ActionItem(new TitleItem(0, '/info/admin', '유저댓글 조회', '유저가 쓴 댓글 조회', 1)));
url1.pushQueryItem(new QueryNBodyItem('code', new QueryNBodyItemInfo('실행변수', 'int', '1', true, '1'), true));
url1.pushQueryItem(new QueryNBodyItem('id', new QueryNBodyItemInfo('유저 ID', 'String', '-', false, ''), true));
url1.pushQueryItem(new QueryNBodyItem('page', new QueryNBodyItemInfo('페이지 크기', 'int', 'gte 0', false, '1'), false));
url1.pushQueryItem(new QueryNBodyItem('pagesize', new QueryNBodyItemInfo('페이지 사이즈', 'int', "gte 0", false, '10'), false));
url1.pushQueryItem(new QueryNBodyItem('order', new QueryNBodyItemInfo('정렬', 'any', '값이 들어가면 ASC', false, ''), false));

url1.addAction(new ActionItem(new TitleItem(0, '/info/admin', '글 신고내역 조회', '특정글 신고내역 조회', 2)));
url1.pushQueryItem(new QueryNBodyItem('code', new QueryNBodyItemInfo('실행변수', 'int', '2', true, '2'), true));
url1.pushQueryItem(new QueryNBodyItem('index', new QueryNBodyItemInfo('조회할 글번호', 'String', '-', false, ''), true));
url1.pushQueryItem(new QueryNBodyItem('page', new QueryNBodyItemInfo('페이지 크기', 'int', 'gte 0', false, '1'), false));
url1.pushQueryItem(new QueryNBodyItem('pagesize', new QueryNBodyItemInfo('페이지 사이즈', 'int', "gte 0", false, '10'), false));

url1.addAction(new ActionItem(new TitleItem(0, '/info/admin', '댓글 신고내역 조회', '특정댓글 신고내역 조회', 3)));
url1.pushQueryItem(new QueryNBodyItem('code', new QueryNBodyItemInfo('실행변수', 'int', '3', true, '3'), true));
url1.pushQueryItem(new QueryNBodyItem('index', new QueryNBodyItemInfo('조회할 댓글번호', 'String', '-', false, ''), true));
url1.pushQueryItem(new QueryNBodyItem('page', new QueryNBodyItemInfo('페이지 크기', 'int', 'gte 0', false, '1'), false));
url1.pushQueryItem(new QueryNBodyItem('pagesize', new QueryNBodyItemInfo('페이지 사이즈', 'int', "gte 0", false, '10'), false));

url1.addAction(new ActionItem(new TitleItem(0, '/community/feedbacklist', '피드백 조회', '피드백 조회 기능', 4)));
url1.pushQueryItem(new QueryNBodyItem('startDate', new QueryNBodyItemInfo('검색 시작 날짜', 'Date', `ex) ${startDate}`, false, ''), false));
url1.pushQueryItem(new QueryNBodyItem('endDate', new QueryNBodyItemInfo('검색 종료 날짜', 'Date', `ex) ${endDate}`, false, ''), false));
url1.pushQueryItem(new QueryNBodyItem('lastRange', new QueryNBodyItemInfo('최근 피드백 날짜', 'int', '1-365 (일)', false, ''), false));
url1.pushQueryItem(new QueryNBodyItem('bigTag', new QueryNBodyItemInfo('대분류 코드', 'String', "정규식 사용 가능 (코드는 숫자 3자리)\n000 - 기타, 001 - 게임, 002 - 서버, 003 - 웹, 004 - 커뮤니티, 005 - 굿즈샵", false, ''), false));
url1.pushQueryItem(new QueryNBodyItem('smallTag', new QueryNBodyItemInfo('소분류 코드', 'String', "정규식 사용 가능 (코드는 숫자 3자리)", false, ''), false));
url1.pushQueryItem(new QueryNBodyItem('desc', new QueryNBodyItemInfo('정렬순서', 'int', "0 - 날짜 내림차순, 1 - 날짜 오름차순, 2 - 추천 내림차순, 3 - 추천 오름차순, 4 - 비추천 내림차순, 5 - 비추천 오름차순", false, ''), false));



export default url1;