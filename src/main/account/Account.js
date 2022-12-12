import React, { useEffect, createContext, useContext, useState } from 'react';
import './account.scss';
import { Section } from './components/Section';
import { Contacts } from './components/contacts/Contacts';
import { Notices } from './components/notices/Notices';
import { Settings } from './components/settings/Settings';
import { DeleteAccount } from './components/settings/DeleteAccount';
import { useAccount } from '../../shared/account';
import { Loading } from '../../common/Loading';
import { NavLink } from 'react-router-dom';

const AccountContext = createContext({});

export const useAccountContext = () => {
    return useContext(AccountContext);
}

const Account = () => {

    const {account} = useAccount();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if(account.user && account.user.isVerified){
            setIsVerified(account.user.isVerified);
        }
    }, [account.user])

    const MessagesButton = () => {
        return(
            <NavLink to='/messages'>
                <button type='button' 
                    className='btn btn-primary btn-lg m-1' 
                    href='/messages'>
                        Messages
                </button>
            </NavLink>
        )
    }

    return(
        <div className='container account-page'>
            <AccountContext.Provider value={{}} >
                <AccountContext.Consumer>
                    {() => (
                        <div>
                            <MessagesButton className='float-end'/>
                            {account.isSet && account.user ? <div>
                                <Section name={`Notices`}>
                                    <Notices verified={isVerified} />
                                </Section>
                                <Section name={`Contacts`} >
                                    <Contacts verified={isVerified}/>
                                </Section>
                                <Section name={`Settings`} >
                                    <Settings account={account}/>
                                </Section>
                                <Section name={`Danger zone`}>
                                    <DeleteAccount user={account.user} />
                                </Section>
                            </div> : <Loading />}
                        </div>
                    )}
                </AccountContext.Consumer>
            </AccountContext.Provider>
        </div>
    );
}

export default Account;