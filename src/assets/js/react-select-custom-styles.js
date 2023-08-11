export const reactSelectCustomStyles = {
    menuList: styles => ({
        ...styles,
        background: '#181633',
        border: "1px solid grey",
        color: "white",
    }),
    option: (styles, {
        isFocused,
        isSelected
    }) => ({
        ...styles,
        background: isFocused ?
            '#2a9fd8' :
            isSelected ?
            '#2a9fd8' // hsla(291, 64%, 42%, 1)
            :
            undefined,
        zIndex: 1,
        paddingTop: 0,
        paddingBottom: 0
    }),
    menu: base => ({
        ...base,
        zIndex: 100,
    })
}