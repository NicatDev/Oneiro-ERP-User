import { refreshDoc } from './refresh.doc';
import { loginDoc } from './login.doc';
import { logoutDoc } from './logout.doc';
import { moduleDoc } from './module.doc';
import { moduleSingleDoc } from './moduleSingle.doc';
import { moduleCreateDoc } from './moduleCreate.doc';
import { userColumnGetDoc } from './userColumnGet.doc';
import { userChangeStatusDoc } from './userChangeStatus.doc';
import { userPutDoc } from './userPut.doc';
import { userPostDoc } from './userPost.doc';
import { userGetDoc } from './userGet.doc';
import { userSingleGetDoc } from './userSingleGet.doc';

export const docs = {
    //auth
    refreshDoc,
    loginDoc,
    logoutDoc,

    //Modules
    moduleDoc,
    moduleCreateDoc,
    moduleSingleDoc,

    //users
    userColumnGetDoc,
    userChangeStatusDoc,
    userGetDoc, 
    userPostDoc, 
    userPutDoc,
    userSingleGetDoc
};