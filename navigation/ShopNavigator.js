import { createAppContainer } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import {Platform} from 'react-native';
import ProductsOverviewScreen from '../screens/shop/ProductsOverview';
import colors from '../constants/colors';

const ProductsNavigator = createStackNavigator({
    ProductsOverview: ProductsOverviewScreen
},
{
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: Platform.OS === 'android' ? colors.primary : ''
        },
        headerTintColor: Platform.OS === 'android' ? 'white' : colors.primary
    }
})


export default createAppContainer(ProductsNavigator);