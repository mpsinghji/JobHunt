import React from 'react'
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table'
import { Badge } from '../ui/badge'


const AppliedJobTable = () => {
  return (
    <div>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        [1].map((item,index)=>(
                            <TableRow key={index}>
                                <TableCell>12/12/2024</TableCell>
                                <TableCell>Frontend Developer</TableCell>
                                <TableCell>Tech Corp</TableCell>
                                <TableCell className="text-right"><Badge>Selected</Badge></TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
  )
}

export default AppliedJobTable