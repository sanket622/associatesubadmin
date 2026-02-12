
import { Tabs, Tab } from '@mui/material';
const ReusableTabs = ({ tabs, activeTab, setActiveTab }) => {
    const isScrollable = tabs.length > 7;
    return (
        <>
            <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                variant={isScrollable ? 'scrollable' : 'fullWidth'}
                scrollButtons={isScrollable ? 'auto' : false}
                allowScrollButtonsMobile
                TabIndicatorProps={{
                    sx: {
                        height: 3,
                        backgroundColor: '#084E77',
                    },
                }}
                sx={{
                    minHeight: 'unset',
                    '& .MuiTabs-flexContainer': {
                        // gap: 1,
                        width: '100%',
                    },
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontSize: 16,
                        minHeight: 'unset',
                        color: '#6B7280',
                        backgroundColor: '#084E770A',
                        // flex: 1,          
                        // minWidth: 0,      
                        // px: 2,
                        // whiteSpace: 'nowrap',
                    },
                    '& .Mui-selected': {
                        color: '#084E77',
                        fontWeight: 600,
                    },
                    '& .MuiTabs-scrollButtons': {
                        opacity: 1,
                    },
                    '& .MuiTabs-scrollButtons.Mui-disabled': {
                        opacity: 0.3,
                    },
                }}
            >

                {tabs.map((tab, index) => (
                    <Tab key={tab.label} label={tab.label} />
                ))}
            </Tabs>
        </>

    );
};


export default ReusableTabs;
