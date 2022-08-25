export const inputValue = `drop table if exists user_ profile;
CREATE TABLE user_ profile’ ( 
‘id’ int NOT NULL, 
‘device_ id’ int NOT NULL,
‘gender’ varchar(14) NOT NULL, 
‘age’ int , 
‘university’ varchar(32) NOT NULL, 
‘province’ varchar(32) NOT NULL); 
INSERT INTO user_ _profile VALUES(1, 2138, ’male’, 21, ’LFX#’, ’BeiJing’); 
INSERT INTO user_ _profile VALUES(2, 3214, ’male’, null, ’ã gt#’, ’Shanghai’); 
INSERT INTO user_ _profile VALUES(3, 6543, ’female’, 20, ’dFX#’, ’BeiJing’);
INSERT INTO user_ _profile VALUES(4, 2315, ’female’, 23, ’ñIt#’, ’ZheJiang’); 
INSERT INTO user_ _profile VALUES(5, 5432, ’male’, 25, ’Ш#’, ’Shandong’);
`;
export const outputValue = `1|2138|male|21|北京大学|BeiJing 
2|3214|male|None|复旦大学|Shanghai 
3|6543|female|20|北京大学|BeiJing 
4|2315|female|23|浙江大学|ZheJiang 
5|5432|male|25|山东大学|Shandong
`;
