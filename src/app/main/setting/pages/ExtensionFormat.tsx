import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import homeIcon from './assets/home.svg';
import calIcon from "./assets/calIcon.svg";
import feeIcon from "./assets/feeIcon.svg";
import buybox from "./assets/buybox.svg";
import add from "./assets/add.svg";
import chartIcon from "./assets/chartIcon.svg";
import healthIcon from "./assets/healthIcon.svg";
import exportIcon from "./assets/exportIcon.svg";
import offerIcon from "./assets/offerIcon.svg";
import variationIcon from "./assets/variationIcon.svg";
import List from '@mui/material/List';
import Box from '@mui/system/Box';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import * as yup from 'yup';
import { DragDropContext, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import PhoneInput from 'react-phone-input-2'
import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { DateTimePicker } from '@mui/x-date-pickers';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import InputLabel from '@mui/material/InputLabel';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
// import { addRole } from '../store/dataSlice';
// import { PermissionData } from '../Permissions'
// import { useAuth } from '../../../auth/AuthContext';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useAppDispatch, useAppSelector } from 'app/store';
import { selectRecords, getRecords, addRecord, updateRecord } from '../store/settingSlice';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
// import { SettingType } from '../types/setting';
import { showMessage } from 'app/store/fuse/messageSlice';
import { PanelsType, SettingType, SettingsType } from '../types/setting';
import FormGroup from '@mui/material/FormGroup';
import TaskListItem from './list';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { selectUser } from 'app/store/user/userSlice';


/**
 * Extension Format
 */
function ExtensionPage() {

    /**
     * Form Validation Schema
     */

    const title = 'Extension Format';
    const userData = useSelector(selectUser);	
    console.log("userData,",userData)
    const defaultValues = {
        panels: [{ id: '1', text: 'QuickInfo', show: false }]

    };

    const schema = yup.object().shape({
        panels: yup.array().of(
            yup.object().shape({
              id: yup.string().required('ID is required'),
              text: yup.string().required('Text is required'),
              show: yup.boolean().required('Show is required'),
            })
          )
    });


    const { control, formState, handleSubmit, watch, setError, setValue, register } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    });
    const { isValid, dirtyFields, errors } = formState;

    const dispatch = useDispatch<any>()

    // const id = "6584060d5629146b7c120c87";
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const [isUpdate, setIsUpdate] = useState(false);
    const [panels, setPanels] = useState<any>([]);
    const records = useAppSelector(selectRecords);


    const handleCancel = () => {
        navigate(-1);
    };

    useEffect(() => {
        setPanels([
            { id: '8', text: 'Offers', show: true },
            { id: '9', text: 'Buy Box ', show: true },
            { id: '6', text: 'Health Analysis', show: true },

            { id: '2', text: 'Statistics' ,show: true },
            { id: '10', text: 'Variations', show: true },

            // { id: '3', text: 'Fee Calc.', show: false },
            { id: '4', text: 'Charts', show: true },
            // { id: '5', text: 'Alerts', show: false },
            { id: '7', text: 'Export', show: true },
            // { id: '11', text: 'VAT Settings', show: false },
            // { id: '12', text: 'European Marketplaces', show: false },
            // { id: '13', text: 'Offers', show: false  },
            // { id: '14', text: 'Lookup Details', show: false },
            // { id: '15', text: 'Geo Location', show: false },
            // { id: '16', text: 'eBay', show: false },
            // { id: '17', text: 'Seller Central', show: false },
            // { id: '18', text: 'Search Again', show: false },
            // { id: '19', text: 'Seller Tool Kit', show: false },
            // { id: '20', text: 'R.O.I', show: false },
            // { id: '21', text: 'Keepa', show: false },
            // { id: '22', text: 'Buy Box Analysis', show: false},
        ])

        dispatch(getRecords());
    }, [dispatch]);

    const handleToggleCompleted = (index: number, show: boolean) => {
        // Create a new array with the same tasks and update the show property at the specified index
        const updatedPanels = panels.map((task, i) =>
            i === index ? { ...task, show } : task
        );

        // Update the state with the new array
        setPanels(updatedPanels);
    };
    const disabledPanels= [
    { id: '88', text: 'Home', show: false, icon: homeIcon },
    { id: '99', text: 'Analysis', show: false, icon: calIcon },
]
console.log(panels);
    const panelsWithIcon = panels.map((item)=> ({...item,icon: item.id=='8'?offerIcon:item.id=='9'? buybox:item.id=='6'?healthIcon:item.id=='4'?chartIcon:item.id=='10'? variationIcon:item.id=='7'?exportIcon:item.id=='2'?feeIcon:add})) ?? []
    console.log(panelsWithIcon);
    
    useEffect(() => {
        const fetchData = async () => {
            try {

                if (!_.isEmpty(records)) {

                    const firstRecord = records.setting_json as SettingsType;       
                    console.log("sdcs",firstRecord)  
                    const panels_json = firstRecord?.panels;
                    if (panels_json) {
                       setPanels(panels_json);
                    }                                                                    
                  

                    setIsUpdate(true);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [records, setValue])

    const onSubmit = async (formData: PanelsType) => {
        try {
            setLoading(true);
            const user_id = userData.uuid;
            


            //   const payload = {
            //     id: user_id,
            //     setting_json: JSON.dumps(self.data),

            //   };
            console.log("fdvfa",formData)
            formData = panels;
            const setting_json: SettingsType = records.setting_json as SettingsType;

            const response = await dispatch(updateRecord({setting_json:{...setting_json, panels: formData}, id: user_id}));

            console.log('API Response:', response.payload);
            dispatch(showMessage({ message: 'Operation successful', variant: 'success' }));

            setLoading(false);
        } catch (error) {
            console.error('Error handling form submission:', error);

            
            dispatch(showMessage({ message: error?.message || 'Error processing operation', variant: 'error' }));

            setLoading(false);
        }
    };

    function onDragEnd(result: DropResult) {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        const { index: destinationIndex } = destination;
        const { index: sourceIndex } = source;

        if (destinationIndex === sourceIndex) {
            return;
        }
        const ordered = _.merge([], panels);

        const [removed] = ordered.splice(sourceIndex, 1);

	    ordered.splice(destinationIndex, 0, removed);

        setPanels(ordered)

        // dispatch(
        // 	reorderList({
        // 		startIndex: sourceIndex,
        // 		endIndex: destinationIndex
        // 	})
        // );
    }


    const data = watch();
    //  console.log('formState:', formState);
    const formContent = (
        <div className=" flex flex-col font-poppins bg-bgwhite  ">
                
            <div className="flex-grow flex">
                {/* First Half */}
               <form
                    name="Settings"
                    noValidate 
                    className=" w-full "
                    onSubmit={handleSubmit(onSubmit)}
                >
                {/* Second Half */}
                    <div className="w-full  flex-1 flex flex-col  items-center  p-8 lg:p-12">

                        <List className="w-full m-0 p-0">
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable
                                    droppableId="list"
                                    type="list"
                                    isDropDisabled
                                    direction="vertical"
                                >
                                    {(provided: DroppableProvided) => (
                                        <>
                                            <div ref={provided.innerRef}>
                                                {disabledPanels.map((item, index) => (
                                                   <TaskListItem icon={item.icon} disabled={true} key={item.id} data={item}  index={index} setDummyTasks={handleToggleCompleted}/>
                                               ))}
                                               
                                            </div>
                                            {provided.placeholder}
                                        </>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </List>
                         <List className="w-full m-0 p-0">
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable
                                    droppableId="list"
                                    type="list"
                                    direction="vertical"
                                >
                                    {(provided: DroppableProvided) => (
                                        <>
                                            <div ref={provided.innerRef}>
                                             
                                                {panelsWithIcon.map((item, index) => (
                                                    <TaskListItem icon={item.icon} key={item.id} data={item}  index={index} setDummyTasks={handleToggleCompleted}/>
                                                ))}
                                            </div>
                                            {provided.placeholder}
                                        </>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </List>
                    </div>

                    {/* <Box
                            className="flex items-center  mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 "
                            sx={{ backgroundColor: 'bg-white' }}
                        >

                            <Button
                                className="ml-auto"
                                onClick={() => history.back()}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="ml-8"
                                variant="contained"
                                color="secondary"
                                type="submit"
                                disabled={!isValid}
                                // onClick={handleSubmit(onSubmit)}
                            >
                                Save
                                {loading && (
                                <div className="ml-8 mt-2">
                                    <CircularProgress size={16} color="inherit" />
                                </div>
						)}
                            </Button>
                        </Box> */}
                </form>
            </div>
                        
        </div>
    );

    const header = (
        <div className="flex w-full container  bg-paper  ">
            <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
                <div className="flex flex-col flex-auto">

                    <Typography className="text-3xl font-semibold tracking-tight leading-8">
                        {title}
                    </Typography>
                    <Typography
                        className="font-medium tracking-tight"
                        color="text.secondary"
                    >
                        Personalize Your Extension Experience
                    </Typography>
                    {/* <div className='mt-20'>
                    <Avatar src="/path/to/avatar-image.jpg" alt="Avatar" />
                    </div> */}
                </div>
                <Box
                    className="flex items-center"
                            sx={{ backgroundColor: 'bg-white' }}
                        >

                            <Button
                                className="ml-auto"
                                onClick={() => history.back()}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="ml-8"
                                variant="contained"
                                color="secondary"
                                type="submit"
                                disabled={!isValid}
                                onClick={handleSubmit(onSubmit)}
                            >
                                Save
                                {loading && (
                                <div className="ml-8 mt-2">
                                    <CircularProgress size={16} color="inherit" />
                                </div>
						)}
                            </Button>
                </Box>



                {/* <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
                    <Button
                        className="whitespace-nowrap"
                        color="secondary"
                        // startIcon={<FuseSvgIcon size={20}>heroicons-solid:close</FuseSvgIcon>}
                        onClick={handleCancel}
                    >
                        Close
                    </Button>
                </div> */}
            </div>
        </div>
    );

    const content = (
        <div className="w-full px-24 md:px-32 pb-24 overflow-auto"  style = {{maxHeight: 'calc(100vh - 200px)' }}>
            {useMemo(() => {
                const container = {
                    show: {
                        transition: {
                            staggerChildren: 0.06
                        }
                    }
                };

                const item = {
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                };

                return (
                    !_.isEmpty(data) && (
                        <motion.div
                            className="w-full"
                            variants={container}
                            initial="hidden"
                            animate="show"
                        >

                            <div className="grid grid-cols-1 gap-32 w-full mt-32">
                                <motion.div
                                    variants={item}
                                    className="xl:col-span-2 flex flex-col flex-auto"
                                >
                                    {/* form content here */}

                                    {formContent}

                                </motion.div>

                            </div>
                        </motion.div>
                    )
                );
            }, [data])}
        </div>
    );

    return (
        <FusePageSimple
            header={header}
            content={content}
        />
    );

}

export default ExtensionPage;