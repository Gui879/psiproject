var express = require('express');
var router = express.Router();
var db =require('../database/database.js');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
router.use(function(req,res,next){
    var token = req.headers['auth-token'];
    jwt.verify(token, process.env.SECRET, function(err,decoded){
        if(err){
            res.status(400).send("The Token is Invalid");
        } else {
            
            req.user_id=decoded.id;
            next();
        }
    })
});

//get endpoints
router.get('/listStudents',function(req,res){
    var query = "select EMAIL,NUM_TELEFONE, a.PRIMEIRONOME, a.ULTIMONOME, concat(a.primeironome,' ',a.ultimonome) as NAME,a.numinst as NUMBER,CONVERT(char(10), a.DATAREGISTO,126) AS DATE,CAST(CASE WHEN ESTADO is null THEN '-' ELSE ESTADO END AS varchar) as STATUS,CAST(CASE WHEN d.NOME is null THEN '-' ELSE d.NOME END AS varchar) as PROGRAM, c.ID_CURSO from aluno a left join CURSOINSCRICAO c on a.idaluno = c.idaluno  left join CURSO d on c.ID_CURSO = d.ID_CURSO and c.id_curso = d.id_curso";
    db.projectDB.query(query).spread(function(result,metadata){
    console.log(result);
       res.json({
            data:result
        })
        
    }).catch(function(err){
        res.status(500).send("Failed!");
    })
});
//CHANGED<--
router.get('/listUsers',function(req,res){
    var query = "SELECT concat(users.PRIMEIRONOME,' ',USERS.ULTIMONOME) as NAME, NUMINST,PRIMEIRONOME,ULTIMONOME,CONVERT(VARCHAR,CAST(DATAREGISTO AS DATE)) as DATE, 'Type' = CASE WHEN SUBSTRING(NUMINST, 1, 1) =  'p' THEN 'Teacher' WHEN SUBSTRING(NUMINST, 1, 1) =  'a' THEN 'Administrator' END,email,num_telefone as numtelefone, DATAREGISTO FROM USERS";
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
       res.json({
            data:result
        })
        
    }).catch(function(err){
        res.status(500).send("Failed!");
    })
});//-->

router.get('/teachersList',function(req,res){
    var query = "select PROFESSOR.IDPROFESSOR, concat(users.PRIMEIRONOME,' ',USERS.ULTIMONOME) as NAME, NUMINST from PROFESSOR, USERS where PROFESSOR.IDUSER=users.IDUSER";
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
       res.json({
            data:result
        })
        
    }).catch(function(err){
        res.status(500).send("Failed!");
    })
});

router.get('/listCursos',function(req,res){
    var query = "select * from curso";

    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send("Failed!");
    });
});

router.get('/programTypes',function(req,res){
    var query = "select CURSOTIPO from curso group by CURSOTIPO";

    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send("Failed!");
    });
});

router.get('/listCourses',function(req,res){
    var query = "Select * from cadeira";
    
    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send("Failed!");
    });
});

router.get('/getRooms',function(req,res){
    var query = "select * from SALAS";
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
    
    
    
});

router.get('/getHours',function(req,res){
    var query = "select IDHORA,CONVERT(char(5), HORAINICIO, 108) AS HORAINICIO, CONVERT(char(5), HORAFIM, 108) AS HORAFIM  from HORAS ORDER BY HORAINICIO";
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
    
    
    
});

router.get('/coursesList',function(req,res){
    var query = "SELECT concat(USERS.PRIMEIRONOME,' ',USERS.ULTIMONOME)AS TEACHER, nome as NAME FROM ( SELECT CADEIRA.NOME, PROFESSOR.IDPROFESSOR, PROFESSOR.IDUSER FROM CADEIRA LEFT JOIN PROFESSOR ON CADEIRA.IDPROFESSOR=PROFESSOR.IDPROFESSOR ) as cadeiras LEFT JOIN USERS ON USERS.IDUSER=cadeiras.IDUSER";
    
    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send("Failed!");
    });
});

router.get('/listPrograms',function(req,res){
    
    var query = "select concat(USERS.PRIMEIRONOME,' ',USERS.ULTIMONOME)AS PROFNAME, CURSOTIPO, DURACAO_SEMESTRES, ID_CURSO, NOME, NUM_HORAS_SEMESTRE, RESPONSAVEL,Y from CURSO, PROFESSOR, USERS WHERE CURSO.RESPONSAVEL=PROFESSOR.IDPROFESSOR AND PROFESSOR.IDUSER=USERS.IDUSER";

    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send("Failed!");
    });
});

router.get('/listTeachers',function(req,res){
    var query = "select concat(USERS.PRIMEIRONOME,' ',USERS.ULTIMONOME)AS name,PROFESSOR.IDPROFESSOR from PROFESSOR,USERS where PROFESSOR.IDUSER=USERS.IDUSER";
    db.projectDB.query(query).spread(function(result,metadata){
    console.log(result);
       res.json({
            data:result
        })
        
    }).catch(function(err){
        res.status(500).send("Failed!");
    })
});








//post endpoints

router.post('/createStudent',function(req,res){
    var query = "insert into aluno(primeironome,ultimonome,num_telefone,email) values('" + req.body.firstname + "','" + req.body.lastname + "','"+req.body.phoneNumber+"','"+req.body.email+"')";
    
    db.projectDB.query(query).spread(function(result,metadata){
        
        query = "select top 1 idaluno from aluno order by dataregisto desc";
        db.projectDB.query(query).spread(function(result,metadata){
            var idaluno = result[0].idaluno;
            console.log(result[0].idaluno);
            query = "insert into cursoinscricao(id_curso,idaluno,estado,datainscricao) values('"+ req.body.idcurso + "','" + idaluno +"','i','2017-11-22')";
    
            db.projectDB.query(query).spread(function(result,metadata){
                res.status(200).send("Sucess!");
                
            }).catch(function(err){
                res.status(500).send("Failed 3!")
            })
            
        }).catch(function(err){
            res.status(500).send("Failed 2!")
        });
        
        
    }).catch(function(err){
        res.status(500).send("Failed!");
    })
    
    
    
    
    
});

router.post('/createUser',function(req,res){
    var query = "insert into users(primeironome,ultimonome,numinst,num_telefone,email) values('" + req.body.firstname + "','" + req.body.lastname + "','"+req.body.type+"','"+req.body.phoneNumber+"','"+req.body.email+"')";
    
    db.projectDB.query(query).spread(function(result,metadata){
        query=" SELECT TOP 1 concat(users.PRIMEIRONOME,' ',USERS.ULTIMONOME) as NAME, NUMINST,PRIMEIRONOME,ULTIMONOME,CONVERT(VARCHAR,CAST(DATAREGISTO AS DATE)) as DATE, 'Type' = CASE WHEN SUBSTRING(NUMINST, 1, 1) =  'p' THEN 'Teacher' WHEN SUBSTRING(NUMINST, 1, 1) =  'a' THEN 'Administrator' END,email,num_telefone as numtelefone, DATAREGISTO FROM USERS order by DATAREGISTO desc";
        db.projectDB.query(query).spread(function(result,metadata){
            res.json({
                'data':result
            })
        }).catch(function(err){
            res.status(500).send("Failed2!");
        })
    }).catch(function(err){
        res.status(500).send("Failed!");
    })
    
    
    
});

router.post('/getCourses',function(req,res){
    var query = "select CADEIRA.NOME from CADEIRA, PROFESSOR, USERS where users.NUMINST='"+req.body.numinst+"' and users.IDUSER=PROFESSOR.IDUSER and PROFESSOR.IDPROFESSOR=CADEIRA.IDPROFESSOR";
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
    
    
    
});

router.post('/revisionDate',function(req,res){
    var query = "UPDATE EXAME SET DATAREVISAO='"+req.body.year+"-"+req.body.month+"-"+req.body.day+"' WHERE IDEXAME="+req.body.id+"";
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
    
    
    
});

router.post('/getEventsByMonthAndYear',function(req,res){
        
    var query = " select distinct EVENTO.IDEVENTO,SALAS.NOMESALA,CONVERT(char(5), HORAS.HORAFIM, 108) AS HORAFIM,CONVERT(char(5), HORAINICIO, 108) AS HORAINICIO, FORMAT(DAY(EVENTO.DATA),'00') as DAY,CADEIRA.NOME from EVENTO,CADEIRA,PROFESSOR,USERS,SALAS,HORAS where EVENTO.IDSALA=SALAS.IDSALA and EVENTO.IDHORA=HORAS.IDHORA and evento.IDCADEIRA=CADEIRA.IDCADEIRA and CADEIRA.IDPROFESSOR=PROFESSOR.IDPROFESSOR and PROFESSOR.IDUSER="+req.body.teacherid+" and MONTH(evento.DATA)="+req.body.month+" and YEAR(evento.DATA)="+req.body.year+" and EVENTO.IDTIPO=1 order by DAY";
    
   
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
    
    
    
});

router.post('/getAllExams',function(req,res){
        
    var query = " select distinct EXAME.ESTADO, EVENTO.IDEVENTO,SALAS.NOMESALA,CONVERT(char(5), HORAS.HORAFIM, 108) AS HORAFIM,CONVERT(char(5), HORAINICIO, 108) AS HORAINICIO, FORMAT(DAY(EVENTO.DATA),'00') as DAY,CADEIRA.NOME from EVENTO,CADEIRA,PROFESSOR,USERS,SALAS,HORAS,EXAME where EXAME.IDEVENTO=EVENTO.IDEVENTO AND EVENTO.IDSALA=SALAS.IDSALA and EVENTO.IDHORA=HORAS.IDHORA and evento.IDCADEIRA=CADEIRA.IDCADEIRA and CADEIRA.IDPROFESSOR=PROFESSOR.IDPROFESSOR and MONTH(evento.DATA)="+req.body.month+" and YEAR(evento.DATA)="+req.body.year+" and EVENTO.IDTIPO=1 order by DAY, EXAME.ESTADO desc";
    
   
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
    
    
    
});

router.post('/deleteExam',function(req,res){
        
    var query = "delete from EVENTO where IDEVENTO="+req.body.idevento;
    
   
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
    
    
    
});

router.post('/coursesListbyTeacher',function(req,res){
    var query = "select * from CADEIRA,PROFESSOR where cadeira.IDPROFESSOR=PROFESSOR.IDPROFESSOR and PROFESSOR.IDUSER="+req.body.userid;
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
});

router.post('/getEvents',function(req,res){
    var query = "  select * from EVENTO, CADEIRA, TIPOEVENTO where EVENTO.IDTIPO=TIPOEVENTO.IDTIPO and EVENTO.IDCADEIRA=CADEIRA.IDCADEIRA and DATA='"+req.body.year+"-"+req.body.month+"-"+req.body.day+"' and IDHORA="+req.body.hour+" and IDSALA="+req.body.room+"";
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
    
    
    
});

router.post('/getEventsTeacher',function(req,res){
      
    
});

router.post('/createExam',function(req,res){
    var query = "INSERT INTO EVENTO(IDSALA,IDHORA,DATA,IDSEMESTRE,IDCADEIRA,IDTIPO) VALUES("+req.body.room+","+req.body.hour+",'"+req.body.date+"',1,"+req.body.course+",1)";
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
    
    
    
});

router.post('/studentsByCourse',function(req,res){
    var query = "select aluno.NUMINST, ALUNO.PRIMEIRONOME, aluno.ULTIMONOME, aluno.IDALUNO from INSCRICAOCADEIRA, ALUNO where INSCRICAOCADEIRA.IDALUNO=ALUNO.IDALUNO and INSCRICAOCADEIRA.IDCADEIRA="+req.body.courseid+"";
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
    
    
    
});

router.post('/studentsInExam',function(req,res){
    var query = "select aluno.NUMINST, ALUNO.PRIMEIRONOME, aluno.ULTIMONOME, aluno.IDALUNO,NOTA from INSCRICAOCADEIRA, ALUNO,NOTA where NOTA.IDALUNO=ALUNO.IDALUNO and INSCRICAOCADEIRA.IDALUNO=ALUNO.IDALUNO and INSCRICAOCADEIRA.IDCADEIRA="+req.body.courseid+" and NOTA.IDEXAME="+req.body.examid+"";
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
    
    
    
});

router.post('/getStudenstByCourse',function(req,res){
    var query = "select aluno.NUMINST,concat(aluno.PRIMEIRONOME,' ',ALUNO.ULTIMONOME) as NAME from ALUNO,INSCRICAOCADEIRA,CADEIRA where ALUNO.IDALUNO=INSCRICAOCADEIRA.IDALUNO and INSCRICAOCADEIRA.IDCADEIRA=CADEIRA.IDCADEIRA and INSCRICAOCADEIRA.ESTADO='inscrito' and CADEIRA.NOME='"+req.body.courseName+"'";
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
});

router.post('/getEnrolledCourses',function(req,res){
    var query = "select CADEIRA.IDCADEIRA,CADEIRA.NOME,CONVERT(char(10), DATAINSCRICAO,126) AS DATA ,CAST(CASE WHEN NOTA_FINAL IS NULL THEN '-' ELSE CONVERT(VARCHAR,NOTA_FINAL) END AS varchar) as NOTA from INSCRICAOCADEIRA,CADEIRA,ALUNO where INSCRICAOCADEIRA.IDCADEIRA=CADEIRA.IDCADEIRA and INSCRICAOCADEIRA.ESTADO='INSCRITO' AND ALUNO.IDALUNO=INSCRICAOCADEIRA.IDALUNO and NUMINST='"+req.body.numinst+"'";
    
    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
    
    
    
});

router.post('/getGrades',function(req,res){
    var query = "select exame.IDEXAME,nota.IDALUNO,IDCADEIRA,NOTA from NOTA,ALUNO,EXAME where nota.IDALUNO=ALUNO.IDALUNO and NOTA.IDEXAME=EXAME.IDEXAME and aluno.NUMINST='"+req.body.numinst+"'";
    
    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
    
    
    
});


router.post('/createProgram',function(req,res){
    var query ="insert into curso(nome,cursotipo,y,duracao_semestres,num_horas_semestre,responsavel) values('" + req.body.name + "','"+req.body.cursotipo+"',"+ req.body.vary + ","+ req.body.duration + ","+ req.body.hours +","+ req.body.responsible +")";
    
    db.projectDB.query(query).spread(function(result,metadata){
        query="select top 1 id_curso from curso order by id_curso desc";
        
        db.projectDB.query(query).spread(function(result,metadata){
            
            res.json({
                "data":result
            })
            
        }).catch(function(err){
            console.log(err);
        })
        
    }).catch(function(err){
        console.log(err);
    })
    
    
});

router.post('/createCourseProgram',function(req,res){
   var query =""+req.body.content+"";

    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send("Failed!");
    });
});

router.post('/listCadeiras',function(req,res){
    
    var query = "select c.idcadeira,c.nome,c.horasensino,b.ano,b.SEMESTRE,b.creditos from cadeira c, CURSOSCADEIRAS b where c.idcadeira = b.idcadeira and b.id_curso =" +req.body.idcurso+" order by ano, SEMESTRE";

    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send("Failed!");
    });
});

router.post('/getExamsbyCourse',function(req,res){
    
    var query = "select DISTINCT IDEXAME, NOME, ESTADO,DAY(DATAALTERACAO) AS DIAALTERACAO,MONTH(DATAALTERACAO) AS MESALTERACAO,YEAR(DATAALTERACAO) AS ANOALTERACAO, DAY(DATAREVISAO) AS DIAREVISAO,MONTH(DATAREVISAO) AS MESREVISAO,YEAR(DATAREVISAO) AS ANOREVISAO,   DAY(DATA) AS DIA,MONTH(DATA) AS MES,YEAR(DATA) AS ANO, EVENTO.DATA from EXAME,CADEIRA,PROFESSOR,EVENTO where EVENTO.IDEVENTO=EXAME.IDEVENTO and EXAME.IDCADEIRA=CADEIRA.IDCADEIRA AND CADEIRA.IDPROFESSOR=PROFESSOR.IDPROFESSOR and PROFESSOR.IDUSER="+req.body.iduser+" AND EXAME.IDCADEIRA="+req.body.courseId+" order by EVENTO.DATA asc";

    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send("Failed!");
    });
});

router.post('/createCourse',function(req,res){
    
    var query = "insert into CADEIRA(nome,IDPROFESSOR,HORASENSINO) values ('"+req.body.name+"','"+req.body.teacherid+"'," + req.body.time + ")";
    

    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send(err);
    });
});

router.post('/insertGrade',function(req,res){
    
    var query = "insert into NOTA(IDEXAME,IDALUNO,NOTA) values('"+req.body.IDEXAME+"','"+req.body.IDALUNO+"',"+req.body.NOTA+")";
    

    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send("Failed!");
    });
});

router.post('/updateGrade',function(req,res){
    
    var query = "update NOTA set NOTA="+req.body.NOTA+" where IDEXAME="+req.body.IDEXAME+" and IDALUNO="+req.body.IDALUNO+"";
    

    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send("Failed!");
    });
});

router.post('/studentCourse',function(req,res){
    var query="select id_curso from cursoinscricao  where idaluno =" + req.body.id;
    
    db.projectDB.query(query).spread(function(result,metadata){
        var idcurso = result[0].id_curso;
        
        var query ="select nome from curso where id_curso = " + idcurso;
        
        db.projectDB.query(query).spread(function(result,metadata){
            res.json({
                "data":result
            })
            
        }).catch(function(err){
            console.log("Bad Query 2");
        })
        
    }).catch(function(err){
        console.log("Bad Query!")
    })
});

router.post('/deleteCourseAssociation',function(req,res){
    //implementation needed
    var query="" + req.body.id;
    
    db.projectDB.query(query).spread(function(result,metadata){
        

        
    }).catch(function(err){
        console.log("Bad Query!")
    })
});

router.post('/teachername',function(req,res){
    var query = "select concat(u.PRIMEIRONOME,' ', u.ULTIMONOME) as NAME from PROFESSOR p, USERS u where p.IDUSER = u.IDUSER and u.IDUSER =" + req.body.teacherid;

    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })

});


//added routes

router.get('/userNumInst',function(req,res){
    var query =" select top 1 NUMINST from users order by dataregisto desc";
    
    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send("Failed!");
    });
    
});

router.get('/studentNumInst',function(req,res){
    var query =" select top 1 NUMINST from aluno order by dataregisto desc";
    
    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send("Failed!");
    });
    
});


router.post('/updateUser',function(req,res){
    var query="update users set PRIMEIRONOME = '"+ req.body.primeironome +"',ULTIMONOME='" + req.body.ultimonome +"' where numinst = '"+ req.body.numinst +"'";
    
    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send("Failed!");
    });
});

router.post('/updateStudent',function(req,res){
    var query="update aluno set PRIMEIRONOME = '"+ req.body.primeironome +"',ULTIMONOME='" + req.body.ultimonome +"', EMAIL='"+req.body.email+"', NUM_TELEFONE='"+req.body.numtelefone+"' where numinst = '"+ req.body.numinst +"'";
    
    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send("Failed!");
    });
});

router.post('/updateStudent2',function(req,res){
    var query="update aluno set PRIMEIRONOME = '"+ req.body.primeironome +"',ULTIMONOME='" + req.body.ultimonome +"'";
    
    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send("Failed!");
    });
});

router.post('/deleteUser',function(req,res){
    var query="delete from users where numinst = '" + req.body.NUMINST+"'";
    
    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send(err);
    });
});

router.post('/deleteTeacherCourseRelation',function(req,res){
    
    var query ="select iduser from users where numinst = '" + req.body.numinst + "'";
    console.log("here");
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        var iduser = result[0].iduser
        console.log(iduser);
        query="select idprofessor from professor where iduser = "+iduser;
        db.projectDB.query(query).spread(function(result,metadata){
            
            var idprof = result[0].idprofessor
            query="update cadeira set idprofessor= null where idprofessor = " + idprof + " and nome = '" + req.body.nome + "'";
            db.projectDB.query(query).spread(function(result,metadata){
                res.json({
                    "data":result
                })
            }).catch(function(err){
                res.status(500).send(err);
            });

        }).catch(function(err){
            res.status(500).send(err);
        });
        
    }).catch(function(err){
        res.status(500).send(err);
    });
    
   
    
    
    
});

router.post('/getCourseByProgram',function(req,res){
    
    var query="select c.NOME,c.idcadeira from cursoscadeiras as cc,cadeira as c where cc.id_curso = '" + req.body.idprogram + "' and cc.idcadeira = c.idcadeira";
    
    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send("Failed!");
    });
    
});

router.post('/createClasses',function(req,res){
    var query =req.body.insert ;
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
    
    
    
});

router.post('/getClassesByProgram',function(req,res){
    var query="SELECT distinct DATEPART(dw,DATA) as weekday,EVENTO.IDSALA,idhora,EVENTO.IDCADEIRA,CURSOSCADEIRAS.ANO, CURSOSCADEIRAS.SEMESTRE from evento,CURSOSCADEIRAS where CURSOSCADEIRAS.ID_CURSO=EVENTO.ID_CURSO and CURSOSCADEIRAS.IDCADEIRA=EVENTO.IDCADEIRA and evento.ID_CURSO="+req.body.idcurso+" and IDTIPO=2 order by ANO asc, SEMESTRE";
    
    
    db.projectDB.query(query).spread(function(result,metadata){
            console.log(result);
            res.json({
                "data":result
            })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
});

router.post('/getScheduleClasses',function(req,res){
    var query="SELECT distinct DATEPART(dw,DATA) as WD,EVENTO.IDSALA,IDHORA,salas.nomesala from evento,salas,cadeira where cadeira.idcadeira=evento.idcadeira and salas.idsala=evento.idsala and idtipo=2 and cadeira.nome='" + req.body.courseName+"' order by IDHORA";
    
    
    db.projectDB.query(query).spread(function(result,metadata){
            console.log(result);
            res.json({
                "data":result
            })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
});

router.post('/insertClass',function(req,res){
    var query="insert into EVENTO(IDSALA,IDHORA,DATA,IDSEMESTRE,IDCADEIRA,ID_CURSO,IDTIPO) values("+req.body.idsala+","+req.body.idhora+",'2017-09-"+req.body.day+"',1,"+req.body.idcadeira+",1,2)";
    
    
    db.projectDB.query(query).spread(function(result,metadata){
            console.log(result);
            res.json({
                "data":result
            })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
});

router.post('/getcourseID',function(req,res){
    var query="select idcadeira from cadeira where nome='"+req.body.nome+"'";
    
    
    db.projectDB.query(query).spread(function(result,metadata){
            console.log(result);
            res.json({
                "data":result
            })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
});

router.post('/getNotifications',function(req,res){
    
    if(req.body.numinst.charAt(0)=='a'){
        var query = "select IDNOTIFCACAO, DATAVISITADO, TIPO, CONCAT(YEAR(DATACRIACAO),'-',MONTH(DATACRIACAO),'-',DAY(DATACRIACAO)) AS DATA, convert(char(5), DATACRIACAO, 108) AS HORA, MENSAGEM FROM NOTIFICACOES,USERS WHERE USERS.NUMINST='"+req.body.numinst+"' and (NOTIFICACOES.RECEIVER=USERS.IDUSER or NOTIFICACOES.RECEIVER is null) and DATAVISITADO is not null order by DATA desc ,HORA";
        db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
           res.json({
                data:result
            })

        }).catch(function(err){
            res.status(500).send("Failed!");
        })
    }else{
        var query = "select IDNOTIFCACAO, DATAVISITADO, TIPO, CONCAT(YEAR(DATACRIACAO),'-',MONTH(DATACRIACAO),'-',DAY(DATACRIACAO)) AS DATA, convert(char(5), DATACRIACAO, 108) AS HORA, MENSAGEM FROM NOTIFICACOES,USERS WHERE USERS.NUMINST='"+req.body.numinst+"' and NOTIFICACOES.RECEIVER=USERS.IDUSER and DATAVISITADO is not null order by DATA desc ,HORA";
        db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
           res.json({
                data:result
            })

        }).catch(function(err){
            res.status(500).send("Failed!");
        })
    }
    
    
});

router.post('/getNewNotifications',function(req,res){
    
    if(req.body.numinst.charAt(0)=='a'){
        var query = "select IDNOTIFCACAO, DATAVISITADO, TIPO, CONCAT(YEAR(DATACRIACAO),'-',MONTH(DATACRIACAO),'-',DAY(DATACRIACAO)) AS DATA, convert(char(5), DATACRIACAO, 108) AS HORA, MENSAGEM FROM NOTIFICACOES,USERS WHERE USERS.NUMINST='"+req.body.numinst+"' and (NOTIFICACOES.RECEIVER=USERS.IDUSER or NOTIFICACOES.RECEIVER is null) and DATAVISITADO is null  order by DATA desc ,HORA";
        db.projectDB.query(query).spread(function(result,metadata){
           res.json({
                data:result
            })

        }).catch(function(err){
            res.status(500).send("Failed!");
        })
    }else{
        var query = "select IDNOTIFCACAO, DATAVISITADO, TIPO, CONCAT(YEAR(DATACRIACAO),'-',MONTH(DATACRIACAO),'-',DAY(DATACRIACAO)) AS DATA, convert(char(5), DATACRIACAO, 108) AS HORA, MENSAGEM FROM NOTIFICACOES,USERS WHERE USERS.NUMINST='"+req.body.numinst+"' and NOTIFICACOES.RECEIVER=USERS.IDUSER and DATAVISITADO is null order by DATA desc ,HORA";
        db.projectDB.query(query).spread(function(result,metadata){
           res.json({
                data:result
            })

        }).catch(function(err){
            res.status(500).send("Failed!");
        })
    }
    
    
});

router.post('/changeDate',function(req,res){
    var query="update NOTIFICACOES set DATAVISITADO=GETDATE() where IDNOTIFCACAO="+req.body.id+"; select IDNOTIFCACAO, DATAVISITADO, TIPO, CONCAT(YEAR(DATACRIACAO),'-',MONTH(DATACRIACAO),'-',DAY(DATACRIACAO)) AS DATA, convert(char(5), DATACRIACAO, 108) AS HORA, MENSAGEM FROM NOTIFICACOES WHERE IDNOTIFCACAO="+req.body.id+"";
    
    
    db.projectDB.query(query).spread(function(result,metadata){
            console.log(result);
            res.json({
                "data":result
            })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
});

router.post('/updateProgram',function(req,res){
    var query=" update curso set nome='" + req.body.nome + "',y="+ req.body.vary +",cursotipo= '" + req.body.cursotipo + "' ,DURACAO_SEMESTRES="+ req.body.duration +",num_horas_semestre =" + req.body.hours+",responsavel=" + req.body.responsible+" where id_curso="+req.body.id;
    
     db.projectDB.query(query).spread(function(result,metadata){
            console.log(result);
            res.status(200).send("Updated");
    }).catch(function(err){
        res.status(500).send("Failed!");
    })
});

router.post('/getNumInstID',function(req,res){
    
    var query=" select u.numinst from professor as p,users as u where p.IDPROFESSOR = "+ req.body.responsible + " and p.iduser= u.iduser"
    db.projectDB.query(query).spread(function(result,metadata){
  
            res.json({
                "data":result
            })
    }).catch(function(err){
        res.status(500).send(err);
    })
})

router.post('/approveExam',function(req,res){
        
    var query = "update EXAME set ESTADO='APROVADO' where EXAME.IDEVENTO="+req.body.idevento;
    
   
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
    
    
    
});

router.post('/getClosestEvent',function(req,res){
        
    var query = "SELECT TOP 1 * FROM ( SELECT IDEVENTO,DATA2,HORA2,NOME,IDTIPO, NOMESALA,DATEDIFF(MINUTE,getdate(),cast(CONCAT(DATA2,' ',HORA2) as datetime)) as DIFF FROM( select CADEIRA.NOME AS NOME,EVENTO.IDEVENTO AS IDEVENTO,EVENTO.IDTIPO AS IDTIPO,SALAS.NOMESALA,Convert(varchar,DATA,102) as DATA2,CONVERT(VARCHAR(5),HORAS.HORAINICIO,108) as HORA2 from EVENTO,CADEIRA,PROFESSOR,HORAS,SALAS where EVENTO.IDSALA=SALAS.IDSALA AND EVENTO.IDHORA=HORAS.IDHORA and EVENTO.IDCADEIRA=CADEIRA.IDCADEIRA and cadeira.IDPROFESSOR=PROFESSOR.IDPROFESSOR and PROFESSOR.IDUSER="+req.body.id+" ) AS NEWTABLE ) AS DIFTABLE where DIFF>=0 order by DIFF";
    
   
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
    
    
    
});

router.post('/deleteStudent',function(req,res){
    var query="delete from ALUNO where NUMINST ='" + req.body.numinst+"'";

    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send(err);
    });
});

router.post('/getProgramCourses',function(req,res){
    var query="  select CURSOSCADEIRAS.*,CADEIRA.NOME, CADEIRA.HORASENSINO from CURSOSCADEIRAS,CADEIRA where CURSOSCADEIRAS.IDCADEIRA=CADEIRA.IDCADEIRA and ID_CURSO="+req.body.id+" order by ANO,SEMESTRE";

    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send(err);
    });
});

router.post('/getEnrroledStudensProgram',function(req,res){
    var query="select count(*) from CURSOINSCRICAO where ID_CURSO="+req.body.id+" and ESTADO='inscrito'";

    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send(err);
    });
});
router.post('/deleteStudyPlan',function(req,res){
    var query="  delete from CURSOSCADEIRAS where ID_CURSO="+req.body.id;

    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send(err);
    });
});

router.post('/deleteProgram',function(req,res){
    var query="  delete from CURSO where ID_CURSO="+req.body.id;

    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send(err);
    });
});

router.post('/availableRooms',function(req,res){
    var query="  select SALAS.IDSALA, SALAS.NOMESALA from SALAS where SALAS.IDSALA not in (SELECT distinct EVENTO.IDSALA from evento,salas where salas.idsala=evento.idsala and IDHORA="+req.body.idhora+" and idtipo=2 and DATEPART(dw,DATA)="+req.body.weekday+")";

    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send(err);
    });
});

router.post('/deleteClasses',function(req,res){
    var query="delete from EVENTO where ID_CURSO="+req.body.idcurso+"";

    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send(err);
    });
});


router.post('/getuser',function(req,res){
    var query ="select PRIMEIRONOME as primeironome, ULTIMONOME as ultimonome, NUM_TELEFONE as telefone, EMAIL as email from [dbo].[USERS] where IDUSER = (select IDUSER from [dbo].LOGIN where USERNAME = '"+ req.body.user +"')";
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })

});
router.post('/userupdate',function(req,res){
    var query = " update USERS set users.NUM_TELEFONE = '"+ req.body.phoneNumber +"', users.EMAIL ='"+ req.body.email + "' where USERS.IDUSER =  (select IDUSER from [dbo].LOGIN where USERNAME = '" + req.body.user +"')";
    db.projectDB.query(query).spread(function(result,metadata){
        console.log(result);
        res.json({
            "data":result
        })

    }).catch(function(err){
        res.status(500).send("Failed!");
    })
});
    router.post('/changepassword',function(req,res){
        var query =  " update login set PASSWORD ='"+req.body.newpassword +"' where USERNAME='"+req.body.user + "'";
        db.projectDB.query(query).spread(function(result,metadata){
            console.log(result);
            res.json({
                "data":result
            })

        }).catch(function(err){
            res.status(500).send("Failed!");
        })

});


    router.post('/getpassword',function(req,res){
        var query =  " select PASSWORD as password from login where username='"+req.body.user+"'";
        db.projectDB.query(query).spread(function(result,metadata){
            console.log(result);
            res.json({
                "data":result
            })

        }).catch(function(err){
            res.status(500).send("Failed!");
        })

    });

 router.post('/getName',function(req,res){
        var query =  " select concat(primeironome,' ',ultimonome) as nome from users where iduser='"+req.body.id+"'";
        db.projectDB.query(query).spread(function(result,metadata){
            console.log(result);
            res.json({
                "data":result
            })

        }).catch(function(err){
            res.status(500).send("Failed!");
        })

    });

router.post('/getCourse',function(req,res){
    var query="select * from cadeira where idcadeira = "+ req.body.idcadeira;
    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send(err);
    });
    
})


router.post('/updateCourse',function(req,res){
    var query="  update cadeira set idprofessor = "+ req.body.idprofessor +",nome='"+ req.body.nome + "' where idcadeira = "+ req.body.idcadeira;
    db.projectDB.query(query).spread(function(result,metadata){
        res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send(err);
    });
})

router.post('/deleteCourse',function(req,res){
    
    var query=" delete from cadeira where idcadeira="+req.body.id;

    db.projectDB.query(query).spread(function(result,metadata){
       res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send(err);
    });

    
});


router.post('/deleteProgramInsc',function(req,res){
    
    var query=" delete from CURSOINSCRICAO where IDALUNO=(select IDALUNO FROM ALUNO WHERE NUMINST='"+req.body.numinst+"')";

    db.projectDB.query(query).spread(function(result,metadata){
       res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send(err);
    });

    
});


router.post('/insertProgram',function(req,res){
    
    var query="insert into CURSOINSCRICAO(ID_CURSO,IDALUNO,ESTADO) values("+req.body.programId+",(select IDALUNO FROM ALUNO WHERE NUMINST='"+req.body.numinst+"'),'i')";

    db.projectDB.query(query).spread(function(result,metadata){
       res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send(err);
    });

    
});

router.post('/approvedCredits',function(req,res){
    
    var query="select sum(CURSOSCADEIRAS.CREDITOS) AS CREDITS from CURSOSCADEIRAS,INSCRICAOCADEIRA,ALUNO where NOTA_FINAL>9.5 and CURSOSCADEIRAS.IDCADEIRA=INSCRICAOCADEIRA.IDCADEIRA and CURSOSCADEIRAS.ID_CURSO="+req.body.idprogram+" and INSCRICAOCADEIRA.IDALUNO=ALUNO.IDALUNO and ALUNO.NUMINST='"+req.body.idaluno+"';";

    db.projectDB.query(query).spread(function(result,metadata){
       res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send(err);
    });

    
});

router.post('/disapprovedCredits',function(req,res){
    
    var query="select sum(CURSOSCADEIRAS.CREDITOS) AS CREDITS from CURSOSCADEIRAS,INSCRICAOCADEIRA,ALUNO where NOTA_FINAL<9.5 and CURSOSCADEIRAS.IDCADEIRA=INSCRICAOCADEIRA.IDCADEIRA and CURSOSCADEIRAS.ID_CURSO="+req.body.idprogram+" and INSCRICAOCADEIRA.IDALUNO=ALUNO.IDALUNO and ALUNO.NUMINST='"+req.body.idaluno+"';";

    db.projectDB.query(query).spread(function(result,metadata){
       res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send(err);
    });

    
});
router.post('/grade',function(req,res){
    
    var query="SELECT  convert(int,(sum(CURSOSCADEIRAS.CREDITOS*INSCRICAOCADEIRA.NOTA_FINAL)/sum(CURSOSCADEIRAS.CREDITOS))) as nota  FROM CURSOSCADEIRAS,INSCRICAOCADEIRA,ALUNO where NOTA_FINAL>9.5 and CURSOSCADEIRAS.IDCADEIRA=INSCRICAOCADEIRA.IDCADEIRA and CURSOSCADEIRAS.ID_CURSO="+req.body.idprogram+" and INSCRICAOCADEIRA.IDALUNO=ALUNO.IDALUNO and ALUNO.NUMINST='"+req.body.idaluno+"';";

    db.projectDB.query(query).spread(function(result,metadata){
       res.json({
            "data":result
        })
    }).catch(function(err){
        res.status(500).send(err);
    });

    
});


module.exports = router;