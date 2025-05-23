import { refreshDoc } from './refresh.doc';
import { loginDoc } from './login.doc';
import { logoutDoc } from './logout.doc';
import { moduleDoc } from './module.doc';
import { userColumnGetDoc } from './userColumnGet.doc';
import { userChangeStatusDoc } from './userChangeStatus.doc';
import { userPutDoc } from './userPut.doc';
import { userPostDoc } from './userPost.doc';
import { userGetDoc } from './userGet.doc';

export const docs = {
    //auth
    refreshDoc,
    loginDoc,
    logoutDoc,

    //Modules
    moduleDoc,

    //users
    userColumnGetDoc,
    userChangeStatusDoc,
    userGetDoc, 
    userPostDoc, 
    userPutDoc
};