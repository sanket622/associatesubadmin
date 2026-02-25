
import { Tabs, Tab, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
const ReusableTabs = ({ tabs, activeTab, setActiveTab }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isScrollable = isMobile;
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
                        width: '100%',
                    },
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontSize: 16,
                        minHeight: 'unset',
                        minWidth: 0,
                        flex: isScrollable ? '0 0 auto' : '1 1 0',
                        whiteSpace: 'normal',
                        lineHeight: 1.2,
                        color: '#6B7280',
                        backgroundColor: '#084E770A',
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

                {tabs.map((tab) => (
                    <Tab key={tab.label} label={tab.label} />
                ))}
            </Tabs>
        </>

    );
};


export default ReusableTabs;
