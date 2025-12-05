import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';
import { isValidBranch, isValidYear, isValidSection, BRANCHES, YEARS, SECTIONS } from '../constants';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const register = async (req: Request, res: Response): Promise<void> => {
    console.log('Register request received:', req.body);
    try {
        const { name, email, password, role, branch, year, section } = req.body;

        // Validate college structure constraints for students
        if (role === 'student') {
            if (branch && !isValidBranch(branch)) {
                res.status(400).json({
                    message: `Invalid branch. Must be one of: ${BRANCHES.join(', ')}`
                });
                return;
            }
            if (year && !isValidYear(Number(year))) {
                res.status(400).json({
                    message: `Invalid year. Must be one of: ${YEARS.join(', ')}`
                });
                return;
            }
            if (section && !isValidSection(section)) {
                res.status(400).json({
                    message: `Invalid section. Must be one of: ${SECTIONS.join(', ')}`
                });
                return;
            }
        }

        console.log('Checking if user exists...');
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            console.log('User already exists');
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Creating user...');
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                role: role || 'student',
                branch,
                year: year ? parseInt(year) : null,
                section,
            },
        });
        console.log('User created:', user.id);

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({ message: 'Something went wrong', error: String(error) });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
