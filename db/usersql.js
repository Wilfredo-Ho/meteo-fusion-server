module.exports = {
    queryAll: 'SELECT * FROM USER',
    insert: 'INSERT INTO USER(name, pwd, gender, age, address) VALUES (?, ?, ?, ?, ?)',
    delete: 'DELETE FROM USER WHERE uid = ?',
    getUserById: 'SELECT * FROM USER WHERE uid = ?',
    update: 'UPDATE USER SET name=?, pwd=?, gender=?, age=?, address=? WHERE uid=?',
    checkName: 'SELECT * FROM USER WHERE name=?',
    login: 'SELECT * FROM USER WHERE name=? and pwd=?'
}