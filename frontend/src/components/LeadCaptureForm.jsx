import React, { useState } from 'react';
import './LeadCaptureForm.css';

const LeadCaptureForm = ({ onSubmit, onSkip }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        // Basic validation
        if (!email && !phone) {
            alert('Please provide at least an email or phone number.');
            setSubmitting(false);
            return;
        }
        await onSubmit({ name, email, phone });
        setSubmitting(false);
    };

    return (
        <div className="lead-capture-form">
            <div className="form-header">
                <h4>Let's keep in touch! 👋</h4>
                <p>Enter your details to receive updates or a follow-up.</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="tel"
                        placeholder="Phone Number (Optional)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-input"
                    />
                </div>
                <button type="submit" className="submit-btn" disabled={submitting}>
                    {submitting ? 'Sending...' : 'Send Info'}
                </button>
                <button type="button" className="skip-btn" onClick={onSkip}>
                    No thanks, just chatting
                </button>
            </form>
        </div>
    );
};

export default LeadCaptureForm;
