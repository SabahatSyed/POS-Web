import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useEffect, useMemo, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
/**
 * The FinanceDashboardAppHeader component.
 */
function BorrowAppHeader() {
    const [tabValue, setTabValue] = useState(0);
    return (
        <>
            <div>
                <Tabs
                    value={tabValue}
                    //onChange={handleTabChange}
                    //indicatorColor="secondary"
                    textColor="secondary"
                    variant="scrollable"
                    scrollButtons="auto"
                    classes={{ root: 'w-full h-64 border-b-1' }}
                >
                    <Tab
                        className="h-64"
                        label="Details"
                    />
                    <Tab
                        className="h-64"
                        label="Tasks"
                    />
                    <Tab
                        className="h-64"
                        label="Documents"
                    />
                    <Tab
                        className="h-64"
                        label="Notes"
                    />
                </Tabs>
                {/* {order && ( 
						<div className="p-16 sm:p-24 max-w-3xl w-full">
							{tabValue === 0 && <OrderDetailsTab />}
							{tabValue === 1 && <ProductsTab />}
							{tabValue === 2 && <InvoiceTab order={order} />}
						</div>
					)}*/}

                <div className="flex w-full container">
                    <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-full p-24 md:p-32 pb-0 md:pb-0">
                        <div className="flex flex-col flex-auto">
                            <Typography className="text-3xl font-semibold tracking-tight leading-8">
                                BORRO
                            </Typography>

                        </div>
                        <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">

                            <Button
                                className="whitespace-nowrap bg-[#0d9488] text-white"

                                variant="contained"
                            //color="success"

                            //onClick={handleCreateClick}
                            >
                                Request Customer Information
                            </Button>
                            <Button
                                className="whitespace-nowrap bg-[#0d9488] text-white"

                                variant="contained"
                            //color="success"

                            //onClick={handleCreateClick}
                            >
                                Approve
                            </Button>
                            <Button
                                className="whitespace-nowrap bg-[#0d9488] text-white"

                                variant="contained"


                            //onClick={handleCreateClick}
                            >
                                Request Documents
                            </Button>
                            <Button
                                className="whitespace-nowrap bg-[#0d9488] text-white"

                                variant="contained"


                            //onClick={handleCreateClick}
                            >
                                Moving to Servicing Pipeline
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default BorrowAppHeader;
