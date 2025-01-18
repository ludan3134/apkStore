import React from 'react'
import * as icons from '@ant-design/icons'

const NewIcon = (props: { icon?: string }) => {
    const { icon } = props;
    const antIcon: { [key: string]: any } = icons;
    if (!icon) {
        return React.createElement(antIcon["MenuOutlined"]);

    }
    return React.createElement(antIcon[icon]);
};

export default NewIcon

