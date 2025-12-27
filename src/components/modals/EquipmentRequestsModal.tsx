import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Wrench, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface EquipmentRequestsModalProps {
    open: boolean;
    onClose: () => void;
    equipment: any;
    requests: any[];
}

export function EquipmentRequestsModal({ open, onClose, equipment, requests }: EquipmentRequestsModalProps) {
    const openRequests = requests.filter(r => r.status !== 'Repaired' && r.status !== 'Cancelled');
    const closedRequests = requests.filter(r => r.status === 'Repaired' || r.status === 'Cancelled');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'In Progress': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Repaired': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Scrap': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wrench className="w-5 h-5" />
                        Maintenance Requests - {equipment?.name}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Serial: {equipment?.serial_number}
                    </p>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Open Requests */}
                    <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            Open Requests ({openRequests.length})
                        </h3>
                        {openRequests.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">No open requests</p>
                        ) : (
                            <div className="space-y-2">
                                {openRequests.map((request) => (
                                    <Card key={request.id} className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium">{request.subject}</h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {request.description || 'No description'}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <Badge className={getStatusColor(request.status)}>
                                                        {request.status}
                                                    </Badge>
                                                    <Badge variant="outline">{request.type}</Badge>
                                                    <Badge variant="outline">{request.priority}</Badge>
                                                </div>
                                            </div>
                                            {request.scheduled_date && (
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(request.scheduled_date), 'MMM dd, yyyy')}
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Closed Requests */}
                    {closedRequests.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-3 text-muted-foreground">
                                Closed Requests ({closedRequests.length})
                            </h3>
                            <div className="space-y-2">
                                {closedRequests.map((request) => (
                                    <Card key={request.id} className="p-3 opacity-60">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-sm">{request.subject}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge className={getStatusColor(request.status)} size="sm">
                                                        {request.status}
                                                    </Badge>
                                                    {request.completed_at && (
                                                        <span className="text-xs text-muted-foreground">
                                                            Completed: {format(new Date(request.completed_at), 'MMM dd')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
