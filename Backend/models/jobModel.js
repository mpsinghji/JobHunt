import { application } from "express";
import mongoose from "mongoose";

const jobSchema= mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    requirements:{
        type:String,
    },
    location:{
        type:String,
    },
    salary:{
        type:String,
    },
    jobType:{
        type:String,
    },
    position:{
        type:String,
        required:true
    },
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true
    },
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    application:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Application"
        }
    ]

});

const Job =mongoose.Schema("Job",jobSchema);
export default Job;