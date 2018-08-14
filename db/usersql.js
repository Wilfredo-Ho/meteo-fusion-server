module.exports = {
    queryAll: 'SELECT * FROM USER',
    insert: 'INSERT INTO USER(name, pwd, gender, age, address) VALUES (?, ?, ?, ?, ?)',
    delete: 'DELETE FROM USER WHERE id = ?',
    getUserById: 'SELECT * FROM USER WHERE id = ?',
    update: 'UPDATE USER SET name=?, pwd=?, gender=?, age=?, address=? WHERE id=?',
    checkName: 'SELECT * FROM USER WHERE name=?',
    login: 'SELECT * FROM USER WHERE name=? and pwd=?'
}