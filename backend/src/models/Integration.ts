import mongoose, { Document, Schema } from 'mongoose';

export type IntegrationType = 'website' | 'whatsapp' | 'messenger' | 'slack';

export interface IIntegration extends Document {
    agentId: mongoose.Types.ObjectId;
    type: IntegrationType;
    config: Record<string, any>; // dynamic fields per integration
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
}

const IntegrationSchema = new Schema<IIntegration>({
    agentId: { type: Schema.Types.ObjectId, ref: 'Agent', required: true },
    type: { type: String, enum: ['website', 'whatsapp', 'messenger', 'slack'], required: true },
    config: { type: Schema.Types.Mixed, required: true }, // e.g., phoneNumber for WhatsApp
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IIntegration>('Integration', IntegrationSchema);
