import React from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Building2, MapPin, Clock, IndianRupee, Briefcase, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const Saved = () => {
  const savedJobs = [
    {
      _id: '1',
      title: 'Frontend Developer',
      companyId: { name: 'Tech Corp' },
      location: 'Remote',
      jobType: 'Full Time',
      position: 'Senior Developer',
      salary: 1500000,
      requirements: ['React', 'TypeScript', 'Node.js'],
      createdAt: new Date().toISOString(),
      status: 'open' // 'open' or 'expired'
    }
  ]

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(salary)
  }

  const handleDelete = (jobId) => {
    // TODO: Implement delete functionality
    console.log('Delete job:', jobId)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Applications</h1>
      {savedJobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">You haven't saved any jobs yet.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Company & Job</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedJobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-semibold">{job.title}</div>
                        <div className="text-sm text-gray-500">{job.companyId.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span>{job.position}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{job.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-gray-500" />
                      <span>{formatSalary(job.salary)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 mr-5"
                      onClick={() => handleDelete(job._id)}
                    >
                      {/* <Trash2 className="h-5 w-5" /> */}
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default Saved