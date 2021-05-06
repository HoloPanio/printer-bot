import { rejects } from "assert";
import axios from "axios";
import * as cfg from '../config';

export function print(msg: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const url = `${cfg.url}/?token=${cfg.token}&msg=${msg}`;
		axios.get(url).then(dat => {
			const data = dat.data;
			resolve();
		}).catch(dat => {
			reject(dat.data || dat);
		})
	})
}