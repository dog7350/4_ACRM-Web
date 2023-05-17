import {UrlForm, ActionItem, QueryNBodyItem, QueryNBodyItemInfo, TitleItem} from './TAForm';

const url1 = new UrlForm('데이터베이스 접근', 2);

url1.addAction(new ActionItem(new TitleItem(1, '/info/admini', 'CREATE', '데이터 생성 INSERT INTO "table""valueName" VALUES("value")', 0)));
url1.pushBodyItem(new QueryNBodyItem('table', new QueryNBodyItemInfo('테이블명', 'String', '테이블명', false, ''), true));
url1.pushBodyItem(new QueryNBodyItem('valueName', new QueryNBodyItemInfo('컬럼명', 'String', '(foo, bar, ...) or ""', false, ''), true));
url1.pushBodyItem(new QueryNBodyItem('value', new QueryNBodyItemInfo('값', 'String', "'foo', 'bar', ...", false, ''), true));

url1.addAction(new ActionItem(new TitleItem(1, '/info/adminr', 'READ', '데이터 조회 SELECT "colname" FROM "table" WHERE "condition"', 1)));
url1.pushQueryItem(new QueryNBodyItem('page', new QueryNBodyItemInfo('페이지 번호', 'int', '페이지 번호', false, '1'), true));
url1.pushQueryItem(new QueryNBodyItem('pageSize', new QueryNBodyItemInfo('페이지 사이즈', 'int', '페이지 사이즈', false, '10'), true));
url1.pushBodyItem(new QueryNBodyItem('table', new QueryNBodyItemInfo('테이블명', 'String', '테이블명', false, ''), true));
url1.pushBodyItem(new QueryNBodyItem('colname', new QueryNBodyItemInfo('조회할 컬럼명', 'String', '* or (foo, bar, ...)', false, '*'), true));
url1.pushBodyItem(new QueryNBodyItem('condition', new QueryNBodyItemInfo('조건', 'String', "1=1 or foo=bar", false, '1=1'), true));

url1.addAction(new ActionItem(new TitleItem(2, '/info/admin', 'UPDATE', '데이터 수정 UPDATE "table" SET "colname" WHERE "condition"', 2)));
url1.pushBodyItem(new QueryNBodyItem('code', new QueryNBodyItemInfo('실행변수', 'int', '0', false, '0'), true));
url1.pushBodyItem(new QueryNBodyItem('table', new QueryNBodyItemInfo('테이블명', 'String', '테이블명', false, ''), true));
url1.pushBodyItem(new QueryNBodyItem('colname', new QueryNBodyItemInfo('바꿀 컬럼값', 'String', 'foo=bar', false, ''), true));
url1.pushBodyItem(new QueryNBodyItem('condition', new QueryNBodyItemInfo('조건값', 'String', "foo='bar'", false, ''), true));

url1.addAction(new ActionItem(new TitleItem(3, '/info/admin', 'DELETE', '데이터 삭제 DELETE FROM "table" WHERE "condition"', 3)));
url1.pushBodyItem(new QueryNBodyItem('table', new QueryNBodyItemInfo('테이블명', 'String', '테이블명', false, ''), true));
url1.pushBodyItem(new QueryNBodyItem('condition', new QueryNBodyItemInfo('바꿀 컬럼값', 'String', 'foo=bar', false, ''), true));

export default url1;