import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import DefaultStackScreenOptions from './DefaultStackScreenOptions';
import Screens from '../screens';

const AdminStack = createStackNavigator();

export default AdminNavigation = () => {
    return (
        <AdminStack.Navigator
            screenOptions={DefaultStackScreenOptions}>
            <AdminStack.Screen
                name="adminlogin"
                component={Screens.CapoLogin} />
            <AdminStack.Screen
                name="adminhome"
                component={Screens.CapoHome} />
            <AdminStack.Screen
                name="PostCreate"
                component={Screens.PostCreate} />
            <AdminStack.Screen
                name="PostPreview"
                component={Screens.PostPreview} />
        </AdminStack.Navigator>
    )
}