const aesjs = require('aes-js');
const fs = require('fs');
const prompt = require('prompt-sync')();
let key = fs.readFileSync('key.txt').toString().split('/').map((i) => parseInt(i));
let m;
do {
	m = prompt('Bạn muốn mã hóa(nhấn 1) hay giải mã(nhấn 2)?: ')
}
while (m != 1 && m != 2)
if (m == 1) {
	let mode = prompt('Chọn chế độ mã hóa(nhập CBC hoặc CTR): ').toString().toLowerCase();
	let path_data = prompt('Nhập tên bản rõ: ');
	let path_enc = prompt('Nhập tên bản mã: ')
	let data = aesjs.utils.utf8.toBytes(fs.readFileSync(`${path_data}.txt`).toString());
	let aesMode;
	if (mode == 'ctr') {
		aesMode = new aesjs.ModeOfOperation.ctr(key);
		let enc = aesjs.utils.hex.fromBytes(aesMode.encrypt(data));
		fs.writeFileSync(`${path_enc}.txt`, enc);
		console.log(`Đã mã hóa xong. Lấy file đã mã hóa trong ${path_enc}.txt`);
	}
	else if (mode == 'cbc') {
		let iv = [...Array(16)].map(i => Math.floor(Math.random() * 256))
		let x = 16 - data.byteLength % 16;
		let tmp = [...data, ...[...Array(x)].map(i => x)]
		data = new Uint8Array(tmp)
		aesMode = new aesjs.ModeOfOperation.cbc(key, iv);
		let enc = aesjs.utils.hex.fromBytes(aesMode.encrypt(data));
		fs.writeFileSync(`${path_enc}.txt`, iv.map(x => x.toString(16)).join("") + enc);
		console.log(`Đã mã hóa xong. Lấy file đã mã hóa trong ${path_enc}.txt`);
	}
}
else {
	let mode = prompt('Chọn chế độ mã hóa(nhập CBC hoặc CTR): ').toString().toLowerCase();
	let path_enc = prompt('Nhập tên bản mã: ');
	let path_data = prompt('Nhập tên bản rõ: ')
	let enc = aesjs.utils.hex.toBytes(fs.readFileSync(`${path_enc}.txt`).toString());
	let aesMode;
	if (mode == 'ctr') {
		aesMode = new aesjs.ModeOfOperation.ctr(key);
	}
	else if (mode == 'cbc') {
		let iv = enc.filter((x, i) => i < 16);
		enc = enc.filter((x, i) => i >= 16)
		aesMode = new aesjs.ModeOfOperation.cbc(key, iv);
	}
	data = aesjs.utils.utf8.fromBytes(aesMode.decrypt(enc));
	fs.writeFileSync(`${path_data}.txt`, data);
	console.log(`Đã giải mã xong. Lấy file trong ${path_data}.txt`);
}





