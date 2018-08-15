module.exports = {
    queryAll: 'SELECT * FROM USER',
    insert: 'INSERT INTO USER(name, pwd, gender, age, info) VALUES (?, ?, ?, ?, ?)',
    delete: 'DELETE FROM USER WHERE uid = ?',
    getUserById: 'SELECT * FROM USER WHERE uid = ?',
    update: 'UPDATE USER SET name=?, pwd=?, gender=?, age=?, info=? WHERE uid=?',
    checkName: 'SELECT * FROM USER WHERE name=?',
    login: 'SELECT * FROM USER WHERE name=? and pwd=?'
}