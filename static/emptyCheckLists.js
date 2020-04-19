const CHECK_LISTS = {
    check_list_zero: {
        id: 0,
        list: [
            {
                section_id: "A",
                section_name: null,
                section_list: [
                    {
                        id: 1,
                        checked: true
                    },
                    {
                        id: 2,
                        checked: false
                    },
                    {
                        id: 3,
                        checked: false
                    }
                ]
            }
        ]
    },
    check_list_first: {
        id: 1,
        list: [
            {
                section_id: "A",
                section_list: [
                    {
                        id: 1,
                        checked: false
                    },
                    {
                        id: 2,
                        checked: false
                    },
                    {
                        id: 3,
                        checked: false
                    }
                ]
            },
            {
                section_id: "B",
                section_list: [
                    {
                        id: 1,
                        checked: false
                    },
                    {
                        id: 2,
                        checked: false
                    },
                    {
                        id: 3,
                        checked: false
                    }
                ]
            }
        ]
    },
    check_list_second: {
        id: 2,
        list: [
            {
                section_id: "A",
                section_list: [
                    {
                        id: 1,
                        checked: false
                    },
                    {
                        id: 2,
                        checked: false
                    },
                    {
                        id: 3,
                        checked: false
                    }
                ]
            }
        ]
    }
}

module.exports = CHECK_LISTS;
